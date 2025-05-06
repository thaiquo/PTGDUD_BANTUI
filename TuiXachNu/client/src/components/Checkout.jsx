"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import provincesData from "/data/vietnam_provinces.json" // Import file JSON

const Checkout = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    paymentMethod: "cod",
    note: "",
  })
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  // Giả lập dữ liệu sản phẩm đã chọn
  const selectedProducts = [
    {
      id: 1,
      tenSanPham: "TDV Đeo Vai Dài Đài Bubbly Sz 26 - Jean",
      giaTien: "983.000₫",
      giaTienSo: 983000,
      soLuong: 1,
      mauSac: "Xanh Jean",
    },
  ]

  useEffect(() => {
    // Khi component mount, nếu đã có tỉnh được chọn trước đó,
    // hãy tải danh sách quận/huyện tương ứng
    if (formData.city) {
      const selectedProvince = provincesData.find((province) => province.value === formData.city)
      setDistricts(selectedProvince?.districts || [])

      // Nếu đã có quận được chọn, tải danh sách phường/xã tương ứng
      if (formData.district) {
        const selectedDistrict = selectedProvince?.districts?.find(
          (district) => district.value === formData.district
        )
        setWards(selectedDistrict?.wards || [])
      } else {
        setWards([]) // Reset phường/xã nếu không có quận nào được chọn
      }
    } else {
      setDistricts([]) // Reset quận/huyện nếu không có tỉnh nào được chọn
      setWards([]) // Reset phường/xã
    }
  }, [formData.city, formData.district])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Nếu thay đổi tỉnh, reset quận và phường
    if (name === "city") {
      setFormData((prev) => ({ ...prev, district: "", ward: "" }))
    }

    // Nếu thay đổi quận, reset phường
    if (name === "district") {
      setFormData((prev) => ({ ...prev, ward: "" }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Xử lý đặt hàng ở đây với formData chứa thông tin địa chỉ chi tiết
    alert("Đặt hàng thành công!" + JSON.stringify(formData))
    navigate("/")
  }

  // Định dạng số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "₫"
  }

  // Tính tổng tiền
  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => total + item.giaTienSo * item.soLuong, 0)
  }

  // Tính phí vận chuyển
  const shippingFee = calculateTotal() >= 500000 ? 0 : 30000

  if (selectedProducts.length === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Vui lòng chọn sản phẩm để thanh toán</h2>
            <p className="text-gray-500 mb-6">Bạn chưa chọn sản phẩm nào để thanh toán</p>
            <Link to="/cart" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
              Quay lại giỏ hàng
            </Link>
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
        <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold mb-4">Thông tin giao hàng</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Họ và tên *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full border rounded p-2"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố *</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full border rounded p-2"
                    >
                      <option value="">Chọn Tỉnh/Thành phố</option>
                      {provincesData.map((province) => (
                        <option key={province.value} value={province.value}>
                          {province.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Quận/Huyện *</label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                      className="w-full border rounded p-2"
                      disabled={!formData.city}
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      {districts.map((district) => (
                        <option key={district.value} value={district.value}>
                          {district.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phường/Xã *</label>
                    <select
                      name="ward"
                      value={formData.ward}
                      onChange={handleChange}
                      required
                      className="w-full border rounded p-2"
                      disabled={!formData.district}
                    >
                      <option value="">Chọn Phường/Xã</option>
                      {wards.map((ward) => (
                        <option key={ward.value} value={ward.value}>
                          {ward.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Địa chỉ chi tiết *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                    placeholder="Số nhà, tên đường..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Ghi chú</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    className="w-full border rounded p-2 h-24"
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                  ></textarea>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Phương thức thanh toán</h2>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 border rounded cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-600"
                  />
                  <span>Thanh toán khi nhận hàng (COD)</span>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="banking"
                    checked={formData.paymentMethod === "banking"}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-600"
                  />
                  <span>Chuyển khoản ngân hàng</span>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="momo"
                    checked={formData.paymentMethod === "momo"}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-600"
                  />
                  <span>Ví MoMo</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-bold mb-4">Đơn hàng của bạn</h2>

              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                  <span>Sản phẩm</span>
                  <span>Tạm tính</span>
                </div>

                <div className="space-y-3">
                  {selectedProducts.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <span className="font-medium line-clamp-1">{item.tenSanPham}</span>
                        <div className="text-sm text-gray-500">
                          <span>Màu: {item.mauSac}</span>
                          <span className="mx-1">×</span>
                          <span>{item.soLuong}</span>
                        </div>
                      </div>
                      <span className="font-medium">{formatCurrency(item.giaTienSo * item.soLuong)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between py-2">
                  <span>Tạm tính</span>
                  <span className="font-medium">{formatCurrency(calculateTotal())}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium">{shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}</span>
                </div>
              </div>

              <div className="flex justify-between py-2 font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-red-600">{formatCurrency(calculateTotal() + shippingFee)}</span>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-red-600 text-white py-3 rounded font-medium mt-6 hover:bg-red-700"
              >
                ĐẶT HÀNG
              </button>

              <p className="text-sm text-gray-500 mt-4">
                Bằng cách đặt hàng, bạn đồng ý với các điều khoản và điều kiện của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Checkout