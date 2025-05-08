// client/src/pages/ProductDetail.jsx
"use client"

import React, { useState, useEffect, useContext } from "react"
import { useParams, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Thumbs } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/thumbs"
import { ProductContext } from "../context/ProductProvider"
import PageTransition from "../components/PageTransition"
import PolicyTabs from "../components/PolicyTabs"
import FlashSaleSlider from "../components/FlashSaleSlider"

const ProductDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const {
    products,
    loading: contextLoading,
    error: contextError,
    currentUser,
    addToCart: addToCartContext,
  } = useContext(ProductContext)

  const [product, setProduct] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartMessage, setCartMessage] = useState(null)

  useEffect(() => {
    if (!contextLoading && !contextError && products && products.length > 0) {
      const foundProduct = products.find((item) => item.id === Number.parseInt(id))
      if (foundProduct) {
        setProduct(foundProduct)
        if (foundProduct.mauSac?.length > 0) {
          setSelectedColor(foundProduct.mauSac[0])
        } else {
          setSelectedColor(null)
        }
      } else {
        setProduct(null)
        setSelectedColor(null)
      }
    }
    window.scrollTo(0, 10)
  }, [id, products, location.pathname, contextLoading, contextError])

  const handleQuantityChange = (type) => {
    if (type === "increase") setQuantity(quantity + 1)
    if (type === "decrease" && quantity > 1) setQuantity(quantity - 1)
  }

  const handleColorChange = (color) => {
    setSelectedColor(color)
  }

  const handleAddToCart = async () => {
    if (!currentUser) {
      setCartMessage({ type: "error", text: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng." })
      return
    }

    if (product && product.mauSac?.length > 0 && !selectedColor) {
      setCartMessage({ type: "error", text: "Vui lòng chọn màu sắc sản phẩm." })
      return
    }

    if (product && selectedColor) {
      try {
        setAddingToCart(true)
        setCartMessage(null)

        const cartItem = {
          idProduct: String(product.id),
          quantity: quantity,
        }

        const result = await addToCartContext(cartItem)

        if (result.success) {
          setCartMessage({
            type: "success",
            text: `Đã thêm ${quantity} sản phẩm "${product.tenSanPham}" màu "${selectedColor.mau}" vào giỏ hàng!`,
          })
        } else {
          setCartMessage({ type: "error", text: result.message || "Không thể thêm sản phẩm vào giỏ hàng." })
        }
      } catch (error) {
        console.error("Error adding to cart:", error)
        setCartMessage({ type: "error", text: "Đã xảy ra lỗi khi thêm vào giỏ hàng." })
      } finally {
        setAddingToCart(false)
      }
    }
  }

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

  if (contextError) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Lỗi tải dữ liệu!</h2>
            <p className="mt-2">{typeof contextError === "string" ? contextError : "Không thể kết nối đến máy chủ hoặc có lỗi xảy ra."}</p>
          </div>
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
            <p className="mt-2">Sản phẩm bạn tìm không tồn tại hoặc đã bị xóa.</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <PageTransition>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {cartMessage && (
          <div className={`mb-4 p-3 rounded ${cartMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{cartMessage.text}</div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-7/12">
            {selectedColor && selectedColor.hinhAnh?.length > 0 ? (
              <>
                <Swiper
                  spaceBetween={10}
                  navigation={true}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  modules={[Autoplay, Navigation, Thumbs]}
                  className="mb-4 rounded-lg"
                  key={selectedColor.id}
                >
                  {selectedColor.hinhAnh.map((img, index) => (
                    <SwiperSlide key={img.id || `main-${index}`}>
                      <img
                        src={img.img || "/placeholder.svg"}
                        alt={`${product.tenSanPham} - ${selectedColor.mau} - ${index + 1}`}
                        className="w-full h-[400px] object-contain md:object-cover rounded-lg"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  watchSlidesProgress={true}
                  modules={[Thumbs, Navigation]}
                  className="thumbs-swiper"
                  key={`thumbs-${selectedColor.id}`}
                >
                  {selectedColor.hinhAnh.map((img, index) => (
                    <SwiperSlide key={img.id || `thumb-${index}`}>
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
              <img
                src={product.hinhAnh?.[0]?.img || selectedColor?.hinhAnh?.[0]?.img || "/placeholder.svg"}
                alt={product.tenSanPham}
                className="w-full h-[400px] object-contain md:object-cover rounded-lg border"
              />
            )}
          </div>

          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.tenSanPham}</h1>
            <p className="text-2xl text-red-600 font-semibold my-3">
              {product.trangThai === 0 ? (
                <>
                  <span className="line-through text-gray-500 mr-2">
                    {Number.parseInt(String(product.giaTien).replace(/\D/g, "")).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                  <span className="text-red-600 font-semibold">
                    {(Number.parseInt(String(product.giaTien).replace(/\D/g, "")) * 0.9).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </>
              ) : (
                Number.parseInt(String(product.giaTien).replace(/\D/g, "")).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
              )}
            </p>

            {product.mauSac && product.mauSac.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">
                  Màu sắc: <span className="font-normal">{selectedColor?.mau}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.mauSac.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleColorChange(color)}
                      className={`w-10 h-10 border-2 rounded-full transition-all duration-200 ease-in-out transform hover:scale-110
                        ${selectedColor?.id === color.id ? "border-red-500 ring-2 ring-red-300" : "border-gray-300"}
                        focus:outline-none focus:ring-2 focus:ring-red-400`}
                      title={color.mau}
                      style={{ backgroundColor: color.maCode || "transparent" }}
                    >
                      {color.hinhAnh?.[0]?.img ? (
                        <img
                          src={color.hinhAnh[0].img || "/placeholder.svg"}
                          alt={color.mau}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        !color.maCode && color.mau.substring(0, 1)
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

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

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-grow bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-70"
                disabled={addingToCart || (!selectedColor && product.mauSac?.length > 0)}
              >
                {addingToCart ? "ĐANG XỬ LÝ..." : "THÊM VÀO GIỎ HÀNG"}
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
      <PolicyTabs />
      <FlashSaleSlider />
      <Footer />
    </PageTransition>
  )
}

export default ProductDetail
