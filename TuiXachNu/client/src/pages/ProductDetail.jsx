"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Thumbs } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/thumbs"
import data from "../../data/menu.json"

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState(null)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const foundProduct = data.sanpham.find((item) => item.id === Number.parseInt(id))
    if (foundProduct) {
      setProduct(foundProduct)
      if (foundProduct.mauSac?.length > 0) {
        setSelectedColor(foundProduct.mauSac[0])
      }
    }
    setLoading(false)
  }, [id])

  const handleQuantityChange = (type) => {
    if (type === "increase") setQuantity(quantity + 1)
    if (type === "decrease" && quantity > 1) setQuantity(quantity - 1)
  }

  const handleColorChange = (color) => setSelectedColor(color)

  const handleAddToCart = () => {
    if (product && selectedColor) {
      // Tạo đối tượng sản phẩm để thêm vào giỏ hàng
      const cartItem = {
        id: product.id,
        tenSanPham: product.tenSanPham,
        giaTien: product.giaTien,
        giaTienSo: Number.parseInt(product.giaTien.replace(/\D/g, "")),
        hinhAnh: selectedColor.hinhAnh?.[0]?.img || "/placeholder.svg",
        soLuong: quantity,
        mauSac: selectedColor.mau,
      }

      // Lưu vào localStorage
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItemIndex = existingCart.findIndex(
        (item) => item.id === cartItem.id && item.mauSac === cartItem.mauSac,
      )

      if (existingItemIndex >= 0) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        existingCart[existingItemIndex].soLuong += quantity
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        existingCart.push(cartItem)
      }

      // Lưu giỏ hàng mới vào localStorage
      localStorage.setItem("cart", JSON.stringify(existingCart))

      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
        </div>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Không tìm thấy sản phẩm!</h2>
            <p className="mt-2">Sản phẩm không tồn tại hoặc đã bị xóa.</p>
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
        <div className="flex flex-col md:flex-row gap-8">
          {/* Ảnh sản phẩm */}
          <div className="md:w-1/2">
            {selectedColor && selectedColor.hinhAnh?.length > 0 && (
              <>
                <Swiper
                  spaceBetween={10}
                  navigation={true}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[Autoplay, Navigation, Thumbs]}
                  className="mb-4 rounded-lg"
                >
                  {selectedColor.hinhAnh.map((img) => (
                    <SwiperSlide key={img.id}>
                      <img
                        src={img.img || "/placeholder.svg"}
                        alt={product.tenSanPham}
                        className="w-full h-[400px] object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  watchSlidesProgress={true}
                  modules={[Thumbs]}
                  className="thumbs-swiper"
                >
                  {selectedColor.hinhAnh.map((img) => (
                    <SwiperSlide key={img.id}>
                      <img
                        src={img.img || "/placeholder.svg"}
                        alt={`thumb-${img.id}`}
                        className="w-full h-20 object-cover border rounded"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            )}
          </div>

          {/* Thông tin chi tiết */}
          <div className="md:w-1/2">
            <h1 className="text-2xl font-bold">{product.tenSanPham}</h1>
            <p className="text-xl text-red-600 font-semibold my-2">{product.giaTien}</p>

            {/* Màu sắc */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">Màu sắc:</h3>
              <div className="flex gap-2">
                {product.mauSac.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(color)}
                    className={`w-10 h-10 border rounded-full ${
                      selectedColor?.id === color.id ? "border-blue-500" : "border-gray-300"
                    } flex items-center justify-center text-xs`}
                  >
                    {color.mau.split("-")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Số lượng */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">Số lượng:</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => handleQuantityChange("decrease")} className="border px-3 py-1">
                  -
                </button>
                <input value={quantity} readOnly className="w-12 text-center border" />
                <button onClick={() => handleQuantityChange("increase")} className="border px-3 py-1">
                  +
                </button>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex gap-4 mb-6">
              <button onClick={handleAddToCart} className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700">
                THÊM VÀO GIỎ
              </button>
              <button className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800">MUA NGAY</button>
            </div>

            {/* Thông tin mô tả */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Thông tin sản phẩm:</h3>
              <ul className="text-sm space-y-1">
                <li>
                  <strong>Chất liệu:</strong> {product.chatLieu}
                </li>
                <li>
                  <strong>Kích thước:</strong> {product.kichThuoc}
                </li>
                <li>
                  <strong>Xuất xứ:</strong> {product.xuatxu}
                </li>
                <li>
                  <strong>Loại:</strong> {product.loai}
                </li>
                <li>
                  <strong>Phong cách:</strong> {product.phongCach}
                </li>
              </ul>
            </div>

            {/* Mô tả */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">Mô tả:</h3>
              <p className="text-sm text-gray-700">{product.moTa}</p>
            </div>

            {/* Chính sách */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">Chính sách:</h3>
              <ul className="text-sm space-y-1">
                <li>✓ Miễn phí giao hàng cho đơn từ 500.000đ</li>
                <li>✓ Đổi trả miễn phí trong 30 ngày</li>
                <li>✓ Bảo hành 12 tháng</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ProductDetail
