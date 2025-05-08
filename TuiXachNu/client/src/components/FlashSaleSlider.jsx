import { useEffect, useState, useContext } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { ProductContext } from '../context/ProductProvider'; // Import ProductContext
import ProductCard from './ProductCard';
import PageTransition from './PageTransition';

const FlashSaleSlider = () => {
  const { products } = useContext(ProductContext); // Lấy dữ liệu sản phẩm từ context
  const [randomProducts, setRandomProducts] = useState([]);

  // Hàm để lấy 10 sản phẩm ngẫu nhiên
  const getRandomProducts = (products, count = 10) => {
    const shuffled = [...products].sort(() => 0.5 - Math.random()); // Trộn sản phẩm ngẫu nhiên
    return shuffled.slice(0, count); // Lấy 10 sản phẩm ngẫu nhiên
  };

  // Đặt sản phẩm ngẫu nhiên khi component được load hoặc khi products thay đổi
  useEffect(() => {
    if (products.length > 0) {
      setRandomProducts(getRandomProducts(products)); // Gọi hàm lấy sản phẩm ngẫu nhiên
    }
  }, [products]); // Khi products thay đổi, cập nhật sản phẩm ngẫu nhiên

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 mt-4 mb-10">
        {/* Thêm thẻ h2 với nội dung sinh động */}
        <h2 className="text-3xl font-semibold text-center mb-6">
          Có thể các nàng sẽ thích
        </h2>
        
        <Swiper
          spaceBetween={20}
          slidesPerView={5} // Hiển thị 5 sản phẩm mỗi lần
          loop={true}
          autoplay={{
            delay: 2000, // Tự động chuyển mỗi 2 giây
            disableOnInteraction: false,
          }}
          navigation={true}
          modules={[Autoplay, Navigation]} // Không sử dụng Pagination nữa
          className="w-full"
        >
          {randomProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} /> {/* Hiển thị sản phẩm */}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </PageTransition>
  );
};

export default FlashSaleSlider;
