import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../App.css";
import Footer from "../components/Footer";
import { ProductContext } from "../context/ProductProvider";
import img1 from "../assets/img1.png" // Sử dụng context
import banner from "../assets/banner.jpg"
import PageTransition from "../components/PageTransition";

const TrangChu = () => {
  const { products } = useContext(ProductContext); // Lấy sản phẩm từ context
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Cập nhật thời gian đếm ngược đến cuối ngày
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const difference = endOfDay - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };
    window.scroll(0,0);
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (num) => String(num).padStart(2, "0");

  return (
    <PageTransition>
      <Navbar />
      <HeroSlider />
      <div className="flex justify-center">
        <img
          src={img1}
          alt="banner"
          className="w-[80%] max-h-[250px] object-contain rounded-xl my-6"
          />
        </div>
      {/* Flash Sale Header */}
      <div className="mb-2 text-center">
        <div className="inline-block h-10 bg-red-600 px-4 py-2 rounded-md text-white text-sm font-semibold">
          FLASH SALE ⏰ {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </div>
      </div>
      


      {/* Flash Sale Slider */}
      <div className="max-w-7xl mx-auto px-4 mt-4 mb-10">
      <Swiper
  spaceBetween={20}
  slidesPerView={5}
  loop={true}
  autoplay={{
    delay: 4000,
    disableOnInteraction: false,
  }}
  navigation={true}
  modules={[Autoplay, Navigation]} // Loại bỏ Pagination
  className="w-full"
>
  {products
    .filter((product) => product.trangThai === 0) // chỉ lấy sản phẩm có trạng thái = 0
    .map((product) => (
      <SwiperSlide key={product.id}>
        <ProductCard product={product} />
      </SwiperSlide>
    ))}
</Swiper>

      </div>

      <div className="text-center mt-6">
        <button className="inline-block text-red-600 border border-red-600 px-6 py-2 rounded-full font-medium hover:bg-red-600 hover:text-white transition">
          <Link to="/productSales">Xem tất cả</Link>
        </button>
      </div>

      {/* Khối TNQ Store */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="rounded-xl h-44 bg-gradient-to-r from-blue-500 via-blue-300 to-black text-white shadow-md p-6 flex flex-col items-start md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-semibold mb-1">Khám phá TNQ Store</h2>
            <p className="text-sm opacity-90">
              Chúng tôi mang đến những mẫu túi xách nữ hiện đại, tinh tế và đầy cá tính 
              - lựa chọn hoàn hảo cho mọi phong cách và dịp đặc biệt
            </p>
            <h3>TNQ Store - Nơi phong cách bắt đầu</h3>
          </div>
          <button className="bg-white text-red-600 px-5 py-2 rounded-full font-semibold hover:bg-red-100 transition duration-300 text-sm">
            <Link to="/productList">Khám phá ngay</Link>
          </button>
        </div>
      </div>

      



      <Footer />
      </PageTransition>
  );
};

export default TrangChu;
