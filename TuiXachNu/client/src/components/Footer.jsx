// import React from 'react';
// import { FaFacebook, FaTwitter, FaGoogle, FaInstagram, FaEnvelope, FaVimeo } from 'react-icons/fa';
// import "../App.css"
// const Footer = () => {
//   const icons = [
//     { icon: FaFacebook, href: "#" },
//     { icon: FaTwitter, href: "#" },
//     { icon: FaGoogle, href: "#" },
//     { icon: FaInstagram, href: "#" },
//     { icon: FaEnvelope, href: "#" },
//     { icon: FaVimeo, href: "#" },
//   ];

//   return (
//     <>
//       <div className="my-4 border-t border-gray-300" />
//       <div className="bg-gray-900 text-neutral-200 text-lg px-6 py-10">
//         <div className="flex justify-center space-x-4 mb-6">
//           {icons.map(({ icon: Icon, href }, idx) => (
//             <a
//               key={idx}
//               href={href}
//               className="p-2 border border-gray-400 rounded hover:bg-gray-300 transition"
//             >
//               <Icon className="text-white text-xl" />
//             </a>
//           ))}
//         </div>

//         <div className="flex justify-center items-center space-x-4 mb-6">
//           <label className="w-28">Sign up:</label>
//           <input
//             type="email"
//             className="w-1/2 px-3 py-2 text-white rounded"
//             placeholder="email"
//           />
//           <button className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition rounded">
//             Subscribe
//           </button>
//         </div>

//         <p className="text-center max-w-4xl mx-auto mb-4">
//           Đừng bỏ lỡ hàng ngàn sản phẩm và chương trình khuyến mãi hấp dẫn từ Website của chúng tôi. Hãy đăng ký nhận bản tin để cập nhật thông tin mới nhất, các xu hướng thời trang túi xách nữ và nhận các ưu đãi đặc biệt dành riêng cho thành viên của chúng tôi.
//         </p>
//         <p className="text-center indent-20 mb-8">
//           Hãy kết nối với chúng tôi qua [các kênh mạng xã hội] để không bỏ lỡ bất kỳ thông tin nào!
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
//           <div>
//             <h3 className="text-white font-semibold mb-2">HỖ TRỢ KHÁCH HÀNG</h3>
//             <p>Hướng dẫn mua hàng trực tuyến</p>
//             <p>Hướng dẫn thanh toán</p>
//             <p>Gửi yêu cầu khiếu nại</p>
//           </div>
//           <div>
//             <h3 className="text-white font-semibold mb-2">CHÍNH SÁCH</h3>
//             <p>Chính sách quy định chung</p>
//             <p>Chính sách vận chuyển</p>
//             <p>Chính sách bảo hành</p>
//             <p>Chính sách chi doanh nghiệp</p>
//           </div>
//           <div>
//             <h3 className="text-white font-semibold mb-2">THÔNG TIN KHUYẾN MÃI</h3>
//             <p>Thông tin khuyến mãi</p>
//             <p>Sản phẩm bán chạy</p>
//             <p>Sản phẩm mới</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Footer;
import React, { useState } from 'react';
import banner from "../assets/banner.jpg"
import {
  FaFacebook,
  FaTwitter,
  FaGoogle,
  FaInstagram,
  FaEnvelope,
  FaVimeo,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

const Footer = () => {
  const icons = [
    { icon: FaFacebook, href: "#" },
    { icon: FaTwitter, href: "#" },
    { icon: FaGoogle, href: "#" },
    { icon: FaInstagram, href: "#" },
    { icon: FaEnvelope, href: "#" },
    { icon: FaVimeo, href: "#" },
  ];

  const [openSections, setOpenSections] = useState({
    support: false,
    policy: false,
    promo: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
    <div className="contact-section max-w-7xl mx-auto px-4 mt-12">
  <div className="flex flex-wrap justify-between items-center gap-8">
    {/* Left Column */}
    <div className="flex-1">
      <div className="contact-info mb-8">
        <h3 className="text-xl font-semibold">GỌI MUA HÀNG ONLINE</h3>
        <h3 className="text-xl font-semibold"> (08:00 - 21:00 mỗi ngày)</h3>
        <p className="phone-number text-lg font-bold text-blue-600">1800 1162</p>
        <p className="text-sm opacity-80">Tất cả các ngày trong tuần (Trừ tết Âm Lịch)</p>
      </div>
      <div className="contact-info">
        <h3 className="text-xl font-semibold">GÓP Ý & KHIẾU NẠI (08:30 - 20:30) </h3>
        

        <p className="phone-number text-lg font-bold text-blue-600">1800 1160</p>
        <p className="text-sm opacity-80">Tất cả các ngày trong tuần (Trừ tết Âm Lịch)</p>
      </div>
    </div>

    {/* Center Column (Map) */}
    <div className="flex-1">
      <div className="address-info text-center">
        <h2 className="text-xl font-semibold mb-4">ĐỊA CHỈ SHOP</h2>
        <div className="map-container">
          <iframe
            className="w-full h-64 rounded-lg shadow-md"
            src="https://www.google.com/maps/embed?pb=..."
            title="Shop Location"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>

    {/* Right Column (Social Media) */}
    <div className="flex-1">
      <div className="social-media text-center">
        <h3 className="text-xl font-semibold mb-4">FANPAGE CỦA CHÚNG TÔI</h3>
        <img src={banner} alt="Fanpage Banner" className="w-full h-auto rounded-lg shadow-md" />
      </div>
    </div>
  </div>
    </div>
    <footer className="bg-gray-100 text-gray-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Top: Social & Newsletter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-gray-300">
          <div className="flex space-x-3">
            {icons.map(({ icon: Icon, href }, idx) => (
              <a
                key={idx}
                href={href}
                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition"
              >
                <Icon className="text-lg" />
              </a>
            ))}
          </div>

          <form className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-1/2">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Đăng ký
            </button>
          </form>
        </div>

        {/* Middle: Description */}
        <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
          <p>
            Đừng bỏ lỡ hàng ngàn sản phẩm và chương trình khuyến mãi hấp dẫn từ Website của chúng tôi...
          </p>
          <p className="italic">
            Hãy kết nối với chúng tôi qua các kênh mạng xã hội...
          </p>
        </div>

        {/* Bottom: 3 columns with dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-sm text-gray-700">
          {/* Support */}
          <div>
            <button
              onClick={() => toggleSection('support')}
              className="w-full flex justify-between items-center text-blue-600 font-semibold"
            >
              HỖ TRỢ KHÁCH HÀNG
              {openSections.support ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openSections.support && (
              <ul className="mt-2 pl-2 space-y-1 text-gray-700">
                <li>Hướng dẫn mua hàng trực tuyến</li>
                <li>Hướng dẫn thanh toán</li>
                <li>Gửi yêu cầu khiếu nại</li>
              </ul>
            )}
          </div>

          {/* Policy */}
          <div>
            <button
              onClick={() => toggleSection('policy')}
              className="w-full flex justify-between items-center text-blue-600 font-semibold"
            >
              CHÍNH SÁCH
              {openSections.policy ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openSections.policy && (
              <ul className="mt-2 pl-2 space-y-1 text-gray-700">
                <li>Chính sách quy định chung</li>
                <li>Chính sách vận chuyển</li>
                <li>Chính sách bảo hành</li>
                <li>Chính sách chi doanh nghiệp</li>
              </ul>
            )}
          </div>

          {/* Promotion */}
          <div>
            <button
              onClick={() => toggleSection('promo')}
              className="w-full flex justify-between items-center text-blue-600 font-semibold"
            >
              THÔNG TIN KHUYẾN MÃI
              {openSections.promo ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openSections.promo && (
              <ul className="mt-2 pl-2 space-y-1 text-gray-700">
                <li>Thông tin khuyến mãi</li>
                <li>Sản phẩm bán chạy</li>
                <li>Sản phẩm mới</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-white text-center text-sm text-gray-500 py-4 border-t border-gray-200">
        &copy; {new Date().getFullYear()} TNQ Store. All rights reserved.
      </div>
    </footer>
    </>
    
  );
};

export default Footer;



