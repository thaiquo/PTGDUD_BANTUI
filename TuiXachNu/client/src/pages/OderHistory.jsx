// client/src/pages/OrderHistory.jsx
"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { ProductContext } from "../context/ProductProvider"
import { ShoppingBagIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"

const OrderHistory = () => {
  const { currentUser, products, fetchOrders } = useContext(ProductContext)
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currentUser) {
      navigate("/login")
      return
    }

    const fetchOrderHistory = async () => {
      setLoading(true)
      try {
        const fetchedOrders = await fetchOrders();
        console.log("Dữ liệu đơn hàng:", fetchedOrders) // Thêm log để debug
        setOrders(fetchedOrders || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching order history:", err)
        setError("Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderHistory()
  }, [currentUser, navigate, fetchOrders])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "₫"
  }

  // Format date from orderid (format: ddMMyyyyHHmm)
  const formatOrderDate = (orderId) => {
    if (!orderId || orderId.length !== 12) return "Không xác định"

    const day = orderId.substring(0, 2)
    const month = orderId.substring(2, 4)
    const year = orderId.substring(4, 8)
    const hour = orderId.substring(8, 10)
    const minute = orderId.substring(10, 12)

    return `${day}/${month}/${year} ${hour}:${minute}`
  }

  // Get product details from product ID (chỉ dùng để lấy tên và hình ảnh)
  const getProductDetails = (productId) => {
    const product = products?.find((p) => String(p.id) === String(productId))
    if (!product) return { tenSanPham: "Sản phẩm không tồn tại", hinhAnh: null }

    return {
      tenSanPham: product.tenSanPham,
      hinhAnh: product.mauSac?.[0]?.hinhAnh?.[0]?.img || "/placeholder.svg",
    }
  }

  // Calculate order total (sử dụng giá đã lưu trong đơn hàng)
  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

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
            <p className="text-gray-500 mb-6">Bạn cần đăng nhập để xem lịch sử đơn hàng</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Đăng nhập ngay
            </button>
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
          <button onClick={() => navigate("/profile")} className="flex items-center text-gray-600 hover:text-red-600">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span>Quay lại</span>
          </button>
          <h1 className="text-2xl font-bold ml-2">
            Lịch sử đơn hàng {orders.length > 0 && `(${orders.length} đơn hàng)`}
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
            <button onClick={() => navigate("/")} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.orderid} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <div className="text-sm text-gray-500">
                      Mã đơn hàng: <span className="font-medium text-gray-700">{order.orderid}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Ngày đặt: <span className="font-medium text-gray-700">{formatOrderDate(order.orderid)}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Người đặt: <span className="font-medium text-gray-700">{order.nameorder}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Số điện thoại: <span className="font-medium text-gray-700">{order.phone}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Tổng tiền:</div>
                    <div className="font-bold text-red-600">{formatCurrency(calculateOrderTotal(order.listorder))}</div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="divide-y">
                    {order.listorder.map((item) => {
                      const product = getProductDetails(item.idProduct)
                      return (
                        <div key={item.id} className="py-4 flex flex-col sm:flex-row gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={product.hinhAnh || "/placeholder.svg"}
                              alt={product.tenSanPham}
                              className="w-20 h-20 object-cover border rounded"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium">{product.tenSanPham}</h3>
                            <div className="text-sm text-gray-500 mt-1">Số lượng: {item.quantity}</div>
                            <div className="text-sm font-medium mt-1">{formatCurrency(item.price)} / sản phẩm</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-red-600">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default OrderHistory