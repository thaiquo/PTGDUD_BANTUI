// client/src/pages/ProductDetail.jsx
"use client"

import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Thumbs } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/thumbs"
import { ProductContext } from "../context/ProductProvider"

const ProductDetail = () => {
  const { id } = useParams()
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
  }, [id, products, contextLoading, contextError])

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

        console.log("Current user:", currentUser)
        console.log("Adding to cart:", {
          idProduct: String(product.id),
          quantity: quantity,
        })

        // Simplify the cart item to only include what the server needs
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
            <p className="mt-2">
              {typeof contextError === "string" ? contextError : "Không thể kết nối đến máy chủ hoặc có lỗi xảy ra."}
            </p>
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
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {cartMessage && (
          <div
            className={`mb-4 p-3 rounded ${cartMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {cartMessage.text}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
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
              {Number.parseInt(String(product.giaTien).replace(/\D/g, "")).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
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

            {/* Rest of your component remains the same */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ProductDetail
