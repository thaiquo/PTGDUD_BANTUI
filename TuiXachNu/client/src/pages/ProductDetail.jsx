import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import data from "../../data/menu.json";

const ProductDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch dữ liệu sản phẩm từ JSON
  useEffect(() => {
    // Giả lập việc fetch dữ liệu
    const fetchProduct = () => {
      setLoading(true);
      try {
        // Tìm sản phẩm theo id
        const foundProduct = data.sanpham.find(
          (item) => item.id === parseInt(id)
        );
        
        if (foundProduct) {
          setProduct(foundProduct);
          // Mặc định chọn màu đầu tiên
          if (foundProduct.mauSac && foundProduct.mauSac.length > 0) {
            setSelectedColor(foundProduct.mauSac[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Xử lý khi thay đổi số lượng
  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Xử lý khi thay đổi màu sắc
  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    // Thêm logic lưu vào giỏ hàng ở đây
  };

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  // Hiển thị thông báo nếu không tìm thấy sản phẩm
  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">
              Không tìm thấy sản phẩm!
            </h2>
            <p className="mt-2">Sản phẩm không tồn tại hoặc đã bị xóa.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Phần hình ảnh sản phẩm */}
          <div className="md:w-1/2">
            {selectedColor && selectedColor.hinhAnh && (
              <>
                <Swiper
                  spaceBetween={10}
                  navigation={true}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mb-4 rounded-lg overflow-hidden"
                >
                  {selectedColor.hinhAnh.map((image) => (
                    <SwiperSlide key={image.id}>
                      <img
                        src={image.img || "/placeholder.svg"}
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
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="thumbs-swiper"
                >
                  {selectedColor.hinhAnh.map((image) => (
                    <SwiperSlide key={image.id}>
                      <div className="cursor-pointer border rounded-md overflow-hidden">
                        <img
                          src={image.img || "/placeholder.svg"}
                          alt={`Thumbnail ${image.id}`}
                          className="w-full h-20 object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            )}
          </div>

          {/* Phần thông tin sản phẩm */}
          <div className="md:w-1/2">
            <h1 className="text-2xl font-bold mb-2">{product.tenSanPham}</h1>
            <p className="text-xl font-semibold text-red-600 mb-4">
              {product.giaTien}
            </p>

            {/* Chọn màu sắc */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Màu sắc:</h3>
              <div className="flex gap-3">
                {product.mauSac.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(color)}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                      selectedColor && selectedColor.id === color.id
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    <span className="text-xs text-center">
                      {color.mau.split("-")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Số lượng */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Số lượng:</h3>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-12 h-10 border-t border-b border-gray-300 text-center"
                />
                <button
                  onClick={() => handleQuantityChange("increase")}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Nút mua hàng */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
              >
                THÊM VÀO GIỎ
              </button>
              <button className="px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition">
                MUA NGAY
              </button>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Thông tin sản phẩm:</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="font-medium">Chất liệu:</span>{" "}
                  {product.chatLieu}
                </li>
                <li>
                  <span className="font-medium">Kích thước:</span>{" "}
                  {product.kichThuoc}
                </li>
                <li>
                  <span className="font-medium">Xuất xứ:</span> {product.xuatxu}
                </li>
                <li>
                  <span className="font-medium">Loại:</span> {product.loai}
                </li>
                <li>
                  <span className="font-medium">Phong cách:</span>{" "}
                  {product.phongCach}
                </li>
              </ul>
            </div>

            {/* Mô tả sản phẩm */}
            <div className="border-t mt-4 pt-4">
              <h3 className="font-semibold mb-2">Mô tả:</h3>
              <p className="text-sm text-gray-700">{product.moTa}</p>
            </div>

            {/* Chính sách */}
            <div className="border-t mt-4 pt-4">
              <h3 className="font-semibold mb-2">Chính sách:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>Miễn phí giao hàng cho đơn hàng từ 500.000đ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>Đổi trả miễn phí trong 30 ngày</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>Bảo hành 12 tháng</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;