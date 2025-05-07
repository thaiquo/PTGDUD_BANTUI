"use client"

import React, { useState, useEffect, useContext } from "react" // Thêm useContext
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Thumbs } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/thumbs"
// import data from "../../data/menu.json" // Xóa import trực tiếp
import { ProductContext } from "../context/ProductProvider" // Import ProductContext

const ProductDetail = () => {
  const { id } = useParams()
  const { products, loading: contextLoading, error: contextError } = useContext(ProductContext) // Sử dụng context

  const [product, setProduct] = useState(null)
  // const [loading, setLoading] = useState(true) // Sẽ sử dụng contextLoading
  const [selectedColor, setSelectedColor] = useState(null)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    // Chỉ tìm sản phẩm khi context đã tải xong, không có lỗi và có sản phẩm
    if (!contextLoading && !contextError && products && products.length > 0) {
      const foundProduct = products.find(
        (item) => item.id === Number.parseInt(id)
      )

      if (foundProduct) {
        setProduct(foundProduct)
        if (foundProduct.mauSac?.length > 0) {
          setSelectedColor(foundProduct.mauSac[0]) // Mặc định chọn màu đầu tiên
        } else {
          setSelectedColor(null)
        }
      } else {
        setProduct(null) // Không tìm thấy sản phẩm
        setSelectedColor(null)
      }
    } else if (!contextLoading && (contextError || !products || products.length === 0)) {
      // Xử lý trường hợp context tải xong nhưng có lỗi hoặc không có sản phẩm
      setProduct(null)
      setSelectedColor(null)
    }
    // Không cần setLoading(false) ở đây nữa vì chúng ta dựa vào contextLoading
  }, [id, products, contextLoading, contextError]) // Thêm contextLoading và contextError vào dependencies

  const handleQuantityChange = (type) => {
    if (type === "increase") setQuantity(quantity + 1)
    if (type === "decrease" && quantity > 1) setQuantity(quantity - 1)
  }

  const handleColorChange = (color) => {
    setSelectedColor(color)
    // Có thể bạn muốn reset thumbsSwiper ở đây nếu hình ảnh thay đổi đáng kể
    // setThumbsSwiper(null); // Hoặc logic cập nhật Swiper phù hợp
  }

  const handleAddToCart = () => {
    if (product && selectedColor) {
      const cartItem = {
        id: product.id,
        tenSanPham: product.tenSanPham,
        giaTien: product.giaTien, // Giữ lại giá tiền dạng chuỗi để hiển thị nếu cần
        giaTienSo: Number.parseInt(String(product.giaTien).replace(/\D/g, "")), // Đảm bảo product.giaTien là chuỗi trước khi replace
        hinhAnh: selectedColor.hinhAnh?.[0]?.img || "/placeholder.svg", // Lấy ảnh đầu tiên của màu đã chọn
        soLuong: quantity,
        mauSac: selectedColor.mau,
      }

      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
      const existingItemIndex = existingCart.findIndex(
        (item) => item.id === cartItem.id && item.mauSac === cartItem.mauSac
      )

      if (existingItemIndex >= 0) {
        existingCart[existingItemIndex].soLuong += quantity
      } else {
        existingCart.push(cartItem)
      }

      localStorage.setItem("cart", JSON.stringify(existingCart))
      alert(`Đã thêm ${quantity} sản phẩm "${product.tenSanPham}" màu "${selectedColor.mau}" vào giỏ hàng!`)
    } else if (product && product.mauSac?.length > 0 && !selectedColor) {
      alert("Vui lòng chọn màu sắc sản phẩm.")
    } else {
      alert("Không thể thêm sản phẩm vào giỏ hàng.")
    }
  }

  // Hiển thị trạng thái tải dữ liệu từ context
  if (contextLoading) {
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

  // Hiển thị lỗi nếu có lỗi từ context
  if (contextError) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Lỗi tải dữ liệu!</h2>
            <p className="mt-2">{typeof contextError === 'string' ? contextError : 'Không thể kết nối đến máy chủ hoặc có lỗi xảy ra.'}</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // Hiển thị nếu không tìm thấy sản phẩm sau khi context đã tải xong
  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Không tìm thấy sản phẩm!</h2>
            <p className="mt-2">Sản phẩm bạn tìm không tồn tại hoặc đã bị xóa.</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // Hiển thị chi tiết sản phẩm
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Ảnh sản phẩm */}
          <div className="md:w-1/2">
            {selectedColor && selectedColor.hinhAnh?.length > 0 ? (
              <>
                <Swiper
                  spaceBetween={10}
                  navigation={true}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  modules={[Autoplay, Navigation, Thumbs]}
                  className="mb-4 rounded-lg"
                  key={selectedColor.id} // Thêm key để Swiper re-render khi màu thay đổi
                >
                  {selectedColor.hinhAnh.map((img, index) => (
                    <SwiperSlide key={img.id || `main-${index}`}> {/* Đảm bảo key là duy nhất */}
                      <img
                        src={img.img || "/placeholder.svg"}
                        alt={`${product.tenSanPham} - ${selectedColor.mau} - ${index + 1}`}
                        className="w-full h-[400px] object-contain md:object-cover rounded-lg" // Thay đổi object-fit nếu cần
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  watchSlidesProgress={true}
                  modules={[Thumbs, Navigation]} // Thêm Navigation cho thumbnails nếu muốn
                  className="thumbs-swiper"
                  key={`thumbs-${selectedColor.id}`} // Thêm key
                >
                  {selectedColor.hinhAnh.map((img, index) => (
                    <SwiperSlide key={img.id || `thumb-${index}`}> {/* Đảm bảo key là duy nhất */}
                      <img
                        src={img.img || "/placeholder.svg"}
                        alt={`thumbnail ${product.tenSanPham} - ${selectedColor.mau} - ${index + 1}`}
                        className="w-full h-20 object-cover border rounded cursor-pointer"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            ) : (
              <img // Ảnh placeholder nếu không có màu được chọn hoặc màu không có ảnh
                src={product.hinhAnh?.[0]?.img || selectedColor?.hinhAnh?.[0]?.img || "/placeholder.svg"}
                alt={product.tenSanPham}
                className="w-full h-[400px] object-contain md:object-cover rounded-lg border"
              />
            )}
          </div>

          {/* Thông tin chi tiết */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.tenSanPham}</h1>
            <p className="text-2xl text-red-600 font-semibold my-3">
              {/* Định dạng giá tiền nếu cần */}
              {Number.parseInt(String(product.giaTien).replace(/\D/g, "")).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </p>

            {/* Màu sắc */}
            {product.mauSac && product.mauSac.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">Màu sắc: <span className="font-normal">{selectedColor?.mau}</span></h3>
                <div className="flex flex-wrap gap-2">
                  {product.mauSac.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleColorChange(color)}
                      className={`w-10 h-10 border-2 rounded-full transition-all duration-200 ease-in-out transform hover:scale-110
                                  ${selectedColor?.id === color.id ? "border-red-500 ring-2 ring-red-300" : "border-gray-300"} 
                                  focus:outline-none focus:ring-2 focus:ring-red-400`}
                      title={color.mau}
                      style={{ backgroundColor: color.maCode || 'transparent' }} // Giả sử có trường maCode cho màu HEX
                    >
                      {/* Hiển thị ảnh thumbnail nhỏ của màu nếu có */}
                      {color.hinhAnh?.[0]?.img ? (
                        <img src={color.hinhAnh[0].img} alt={color.mau} className="w-full h-full object-cover rounded-full"/>
                      ) : (
                        // Hoặc hiển thị mã màu nếu không có ảnh
                        !color.maCode && color.mau.substring(0,1) // Hiển thị chữ cái đầu nếu không có mã màu và ảnh
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Số lượng */}
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Số lượng:</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleQuantityChange("decrease")} 
                  className="border px-4 py-2 rounded-md text-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="number"
                  value={quantity} 
                  readOnly 
                  className="w-16 text-center border rounded-md py-2 focus:outline-none" 
                />
                <button 
                  onClick={() => handleQuantityChange("increase")} 
                  className="border px-4 py-2 rounded-md text-lg hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button 
                onClick={handleAddToCart} 
                className="flex-grow bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                disabled={!selectedColor && product.mauSac?.length > 0} // Vô hiệu hóa nếu cần chọn màu mà chưa chọn
              >
                THÊM VÀO GIỎ HÀNG
              </button>
              <button className="flex-grow bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
                MUA NGAY
              </button>
            </div>

            {/* Thông tin mô tả */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2 text-md">Thông tin sản phẩm:</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                {product.chatLieu && <li><strong>Chất liệu:</strong> {product.chatLieu}</li>}
                {product.kichThuoc && <li><strong>Kích thước:</strong> {product.kichThuoc}</li>}
                {product.xuatxu && <li><strong>Xuất xứ:</strong> {product.xuatxu}</li>}
                {product.loai && <li><strong>Loại:</strong> {product.loai}</li>}
                {product.phongCach && <li><strong>Phong cách:</strong> {product.phongCach}</li>}
              </ul>
            </div>

            {/* Mô tả chi tiết */}
            {product.moTa && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-2 text-md">Mô tả chi tiết:</h3>
                <p className="text-sm text-gray-700 whitespace-pre-line">{product.moTa}</p>
              </div>
            )}
            
            {/* Chính sách */}
            <div className="border-t pt-4 mt-4 bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2 text-md">Chính sách & Ưu đãi:</h3>
              <ul className="text-sm space-y-1 text-gray-700 list-disc list-inside">
                <li>Miễn phí giao hàng cho đơn từ 500.000đ</li>
                <li>Đổi trả miễn phí trong 30 ngày</li>
                <li>Bảo hành chính hãng 12 tháng</li>
                <li>Tích điểm thành viên nhận ưu đãi</li>
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