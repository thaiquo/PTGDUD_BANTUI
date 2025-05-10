// client/src/pages/Cart.jsx
"use client"

import { useState, useEffect, useContext, useCallback } from "react" // Import useCallback
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  TruckIcon,
  ArrowPathIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline"
import { ProductContext } from "../context/ProductProvider" // Import ProductContext

const Cart = () => {
  const navigate = useNavigate()
  const {
    currentUser,
    cart: contextCart,
    fetchCart,
    removeFromCart: removeFromCartContext,
    updateCartQuantity: updateCartQuantityContext,
    products,
  } = useContext(ProductContext)

  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [selectedItems, setSelectedItems] = useState({})
  const [error, setError] = useState(null)

  const loadCart = useCallback(async () => {
    if (!currentUser) {
      return
    }

    setLoading(true)
    try {
      const cartData = await fetchCart()

      if (products && products.length > 0) {
        const processedCart = cartData
          .map((item) => {
            const product = products.find((p) => String(p.id) === String(item.idProduct))
            if (!product) return null

            const defaultImage = product.mauSac?.[0]?.hinhAnh?.[0]?.img || "/placeholder.svg"

            return {
              ...item,
              idProduct: item.idProduct,
              quantity: item.quantity,
              tenSanPham: product.tenSanPham,
              giaTien: item.price,
              hinhAnh: defaultImage,
              mauSac: product.mauSac?.[0]?.mau || "Mặc định",
            }
          })
          .filter(Boolean)

        setCartItems(processedCart)

        const initialSelected = {}
        processedCart.forEach((item) => {
          initialSelected[item.idProduct] = true
        })
        setSelectedItems(initialSelected)
      }
      setError(null)
    } catch (err) {
      console.error("Error loading cart:", err)
      setError("Không thể tải giỏ hàng. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }, [currentUser, products, fetchCart])

  useEffect(() => {
    let isMounted = true

    loadCart()
      .then(() => {
        if (isMounted) {
          setLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [currentUser, loadCart]) // Chỉ phụ thuộc vào currentUser và loadCart (đã memoize)

  // Calculate total price of selected items
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems[item.idProduct]) {
        return total + item.giaTien * item.quantity
      }
      return total
    }, 0)
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "₫"
  }

  // Handle select/deselect all products
  const handleSelectAll = (isSelected) => {
    const newSelectedItems = {}
    cartItems.forEach((item) => {
      newSelectedItems[item.idProduct] = isSelected
    })
    setSelectedItems(newSelectedItems)
  }

  // Handle select/deselect one product
  const handleSelectItem = (idProduct, isSelected) => {
    setSelectedItems((prev) => ({
      ...prev,
      [idProduct]: isSelected,
    }))
  }

  // Handle quantity change
  // const handleQuantityChange = async (idProduct, type) => {
  //   const itemToUpdate = cartItems.find((item) => item.idProduct === idProduct)
  //   if (itemToUpdate) {
  //     const newQuantity = type === "increase" ? itemToUpdate.quantity + 1 : Math.max(1, itemToUpdate.quantity - 1)

  //     setLoading(true)
  //     try {
  //       await updateCartQuantityContext(idProduct, newQuantity)
  //       setCartItems((prev) =>
  //         prev.map((item) => (item.idProduct === idProduct ? { ...item, quantity: newQuantity } : item)),
  //       )
  //     } catch (err) {
  //       console.error("Error updating quantity:", err)
  //       setError("Không thể cập nhật số lượng. Vui lòng thử lại.")
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  // }
  const handleQuantityChange = async (idProduct, type) => {
  const itemIndex = cartItems.findIndex((item) => item.idProduct === idProduct);

  if (itemIndex !== -1) {
    const updatedCart = [...cartItems]; // Tạo copy của cartItems
    const itemToUpdate = updatedCart[itemIndex];
    const newQuantity = type === "increase" ? itemToUpdate.quantity + 1 : Math.max(1, itemToUpdate.quantity - 1);

    // Cập nhật giao diện ngay lập tức
    updatedCart[itemIndex] = { ...itemToUpdate, quantity: newQuantity, isUpdating: true };
    setCartItems(updatedCart);

    try {
      // Gọi API để cập nhật trên server
      await updateCartQuantityContext(idProduct, newQuantity);

      // Xóa trạng thái cập nhật sau khi thành công
      setCartItems((prev) => {
        const updated = [...prev];
        updated[itemIndex] = { ...updated[itemIndex], isUpdating: false };
        return updated;
      });
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Không thể cập nhật số lượng. Vui lòng thử lại.");

      // Rollback nếu thất bại
      setCartItems((prev) => {
        const revertedCart = [...prev];
        revertedCart[itemIndex] = { ...itemToUpdate, isUpdating: false };
        return revertedCart;
      });
    }
  }
};

  // Handle remove item
  const handleRemoveItem = async (idProduct) => {
    setLoading(true)
    try {
      await removeFromCartContext(idProduct)
      setCartItems((prev) => prev.filter((item) => item.idProduct !== idProduct))
      setSelectedItems((prev) => {
        const updated = { ...prev }
        delete updated[idProduct]
        return updated
      })
    } catch (err) {
      console.error("Error removing item:", err)
      setError("Không thể xóa sản phẩm. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  // Check if all products are selected
  const isAllSelected = cartItems.length > 0 && cartItems.every((item) => selectedItems[item.idProduct])

  // Check if any items are selected
  const hasSelectedItems = Object.values(selectedItems).some((value) => value)

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600" />
        </div>
        <Footer />
      </>
    )
  }

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-center py-12 bg-white rounded-lg shadow-sm max-w-md w-full">
            <ShoppingBagIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Vui lòng đăng nhập</h2>
            <p className="text-gray-500 mb-6">Bạn cần đăng nhập để xem giỏ hàng của mình</p>
            <Link to="/login" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center py-12 bg-white rounded-lg shadow-sm max-w-md w-full">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBagIcon className="h-6 w-6 text-red-600" />
          <h1 className="text-2xl font-bold">
            Giỏ hàng của bạn {cartItems.length > 0 && `(${cartItems.length} sản phẩm)`}
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-lg text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
            <Link to="/" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-5 h-5 text-red-600"
                  />
                  <label htmlFor="select-all" className="ml-2 font-medium">
                    TẤT CẢ ({cartItems.length} SẢN PHẨM)
                  </label>
                </div>

                <div className="hidden md:grid grid-cols-12 text-sm font-medium text-gray-500 mb-2 gap-2">
                  <div className="col-span-6">SẢN PHẨM</div>
                  <div className="col-span-2 text-center">GIÁ</div>
                  <div className="col-span-2 text-center">SỐ LƯỢNG</div>
                  <div className="col-span-2 text-center">THÀNH TIỀN</div>
                </div>

                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.idProduct} className="py-4">
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-1">
                          <input
                            type="checkbox"
                            checked={selectedItems[item.idProduct] || false}
                            onChange={(e) => handleSelectItem(item.idProduct, e.target.checked)}
                            className="w-5 h-5 text-red-600"
                          />
                        </div>
                        <div className="col-span-11 md:col-span-5">
                          <div className="flex gap-3">
                            <div className="flex-shrink-0">
                              <img
                                src={item.hinhAnh || "/placeholder.svg"}
                                alt={item.tenSanPham}
                                className="w-20 h-20 object-cover border rounded"
                              />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium line-clamp-2">{item.tenSanPham}</h3>
                              <p className="text-xs text-gray-500 mt-1">Màu: {item.mauSac}</p>
                              <button
                                onClick={() => handleRemoveItem(item.idProduct)}
                                className="text-sm text-gray-500 hover:text-red-600 mt-2 flex items-center gap-1"
                              >
                                <TrashIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Xóa</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-2 text-center">
                          <div className="font-medium">{formatCurrency(item.giaTien)}</div>
                        </div>
                        <div className="col-span-6 md:col-span-2">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleQuantityChange(item.idProduct, "decrease")}
                              className="w-8 h-8 flex items-center justify-center border rounded-l"
                              disabled={item.quantity <= 1}
                            >
                              <MinusIcon className="h-3 w-3" />
                            </button>
                            <input
                              type="text"
                              value={item.quantity}
                              readOnly
                              className="w-10 h-8 text-center border-y"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.idProduct, "increase")}
                              className="w-8 h-8 flex items-center justify-center border rounded-r"
                            >
                              <PlusIcon className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div className="col-span-12 md:col-span-2 text-center md:text-right font-medium text-red-600">
                          {formatCurrency(item.giaTien * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                <h2 className="font-bold text-lg mb-4">TÓM TẮT ĐƠN HÀNG</h2>

                <div className="text-sm text-gray-500 mb-2">Chưa bao gồm phí vận chuyển:</div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Tổng tiền:</span>
                  <span className="font-bold text-lg text-red-600">{formatCurrency(calculateTotal())}</span>
                </div>

                <div className="text-sm italic text-gray-500 my-3">Bạn có thể nhập mã giảm giá ở trang thanh toán</div>

                <button
                  onClick={() => {
                    if (hasSelectedItems) {
                      // Get selected items
                      const selectedCartItems = cartItems.filter((item) => selectedItems[item.idProduct])
                      // Store in sessionStorage for checkout page
                      sessionStorage.setItem("checkoutItems", JSON.stringify(selectedCartItems))
                      navigate("/checkout")
                    }
                  }}
                  className={`block w-full py-3 mb-3 rounded font-medium text-center ${
                    hasSelectedItems
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!hasSelectedItems}
                >
                  TIẾN HÀNH ĐẶT HÀNG
                </button>

                <Link
                  to="/"
                  className="block w-full py-3 border border-gray-300 rounded text-center font-medium hover:bg-gray-50"
                >
                  MUA THÊM SẢN PHẨM
                </Link>

                <div className="mt-6 space-y-4">
                  <div className="flex gap-2 items-center text-sm">
                    <TruckIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium">MIỄN PHÍ GIAO HÀNG TOÀN QUỐC</div>
                      <div className="text-gray-500">(Sản phẩm trên 500,000₫)</div>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center text-sm">
                    <ArrowPathIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium">ĐỔI TRẢ DỄ DÀNG</div>
                      <div className="text-gray-500">(Đổi trả 90 ngày cho Giày và 30 ngày cho Túi)</div>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center text-sm">
                    <PhoneIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium">TỔNG ĐÀI BÁN HÀNG 036 866 3456</div>
                      <div className="text-gray-500">(Miễn phí từ 8h30 - 22:00 mỗi ngày)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default Cart