import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ProductContext } from "../context/ProductProvider"; // Sử dụng context

const HeroSlider = () => {
  const { banner } = useContext(ProductContext); // Lấy banner từ context

  if (!banner || banner.length === 0) {
    return <div>Đang tải banner...</div>;
  }

  return (
    <div className="mb-1.5 w-full h-[80vh] max-h-[700px]">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full h-full"
      >
        {banner.map((slide) => (
          <SwiperSlide key={slide.id}>
            <img
              src={slide.imageUrl}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
