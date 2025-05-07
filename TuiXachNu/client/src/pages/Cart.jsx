"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useCart } from "../context/CartContext"
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  TruckIcon,
  ArrowPathIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline"

const Cart = () => {
  // Sử dụng CartContext thay vì trực tiếp từ localStorage
  const {
    cartItems,
    selectedItems,
    toggleSelectItem,
    toggleSelectAll,
    updateQuantity,
    removeFromCart,
    calculateTotal,
    isAllSelected,
    hasSelectedItems,
  } = useCart()

  // Không cần loading state nữa vì dữ liệu đã được quản lý bởi CartContext
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Chỉ cần một hiệu ứng loading ngắn
    setLoading(true)
    setTimeout(() => setLoading(false), 300)
  }, [])

  // Định dạng số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "₫"
  }

  // Xử lý chọn/bỏ chọn tất cả sản phẩm
  const handleSelectAll = (isSelected) => {
    toggleSelectAll(isSelected)
  }

  // Xử lý chọn/bỏ chọn một sản phẩm
  const handleSelectItem = (id, mauSac, isSelected) => {
    toggleSelectItem(id, mauSac, isSelected)
  }

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (id, mauSac, type) => {
    const item = cartItems.find((item) => item.id === id && item.mauSac === mauSac)
    if (!item) return

    if (type === "increase") {
      updateQuantity(id, mauSac, item.soLuong + 1)
    } else if (type === "decrease" && item.soLuong > 1) {
      updateQuantity(id, mauSac, item.soLuong - 1)
    }
  }

  // Xử lý xóa sản phẩm
  const handleRemoveItem = (id, mauSac) => {
    removeFromCart(id, mauSac)
  }

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
                    <div key={item.id + "-" + item.mauSac} className="py-4">
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-1">
                          <input
                            type="checkbox"
                            checked={selectedItems[item.id + "-" + item.mauSac] || false}
                            onChange={(e) => handleSelectItem(item.id, item.mauSac, e.target.checked)}
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
                                onClick={() => handleRemoveItem(item.id, item.mauSac)}
                                className="text-sm text-gray-500 hover:text-red-600 mt-2 flex items-center gap-1"
                              >
                                <TrashIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Xóa</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-2 text-center">
                          <div className="font-medium">{item.giaTien}</div>
                          {item.giaGoc && <div className="text-sm text-gray-500 line-through">{item.giaGoc}</div>}
                        </div>
                        <div className="col-span-6 md:col-span-2">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.mauSac, "decrease")}
                              className="w-8 h-8 flex items-center justify-center border rounded-l"
                            >
                              <MinusIcon className="h-3 w-3" />
                            </button>
                            <input
                              type="text"
                              value={item.soLuong}
                              readOnly
                              className="w-10 h-8 text-center border-y"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.id, item.mauSac, "increase")}
                              className="w-8 h-8 flex items-center justify-center border rounded-r"
                            >
                              <PlusIcon className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div className="col-span-12 md:col-span-2 text-center md:text-right font-medium text-red-600">
                          {formatCurrency(item.giaTienSo * item.soLuong)}
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

                <Link
                  to="/checkout"
                  className={`block w-full py-3 mb-3 rounded font-medium text-center ${
                    hasSelectedItems
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={(e) => !hasSelectedItems && e.preventDefault()}
                >
                  TIẾN HÀNH ĐẶT HÀNG
                </Link>

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
