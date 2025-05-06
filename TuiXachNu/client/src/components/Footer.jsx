import React from 'react';
import { FaFacebook, FaTwitter, FaGoogle, FaInstagram, FaEnvelope, FaVimeo } from 'react-icons/fa';
import "../App.css"
const Footer = () => {
  const icons = [
    { icon: FaFacebook, href: "#" },
    { icon: FaTwitter, href: "#" },
    { icon: FaGoogle, href: "#" },
    { icon: FaInstagram, href: "#" },
    { icon: FaEnvelope, href: "#" },
    { icon: FaVimeo, href: "#" },
  ];

  return (
    <>
      <div className="my-4 border-t border-gray-300" />
      <div className="bg-gray-900 text-neutral-200 text-lg px-6 py-10">
        <div className="flex justify-center space-x-4 mb-6">
          {icons.map(({ icon: Icon, href }, idx) => (
            <a
              key={idx}
              href={href}
              className="p-2 border border-gray-400 rounded hover:bg-gray-300 transition"
            >
              <Icon className="text-white text-xl" />
            </a>
          ))}
        </div>

        <div className="flex justify-center items-center space-x-4 mb-6">
          <label className="w-28">Sign up:</label>
          <input
            type="email"
            className="w-1/2 px-3 py-2 text-white rounded"
            placeholder="email"
          />
          <button className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition rounded">
            Subscribe
          </button>
        </div>

        <p className="text-center max-w-4xl mx-auto mb-4">
          Đừng bỏ lỡ hàng ngàn sản phẩm và chương trình khuyến mãi hấp dẫn từ Website của chúng tôi. Hãy đăng ký nhận bản tin để cập nhật thông tin mới nhất, các xu hướng thời trang túi xách nữ và nhận các ưu đãi đặc biệt dành riêng cho thành viên của chúng tôi.
        </p>
        <p className="text-center indent-20 mb-8">
          Hãy kết nối với chúng tôi qua [các kênh mạng xã hội] để không bỏ lỡ bất kỳ thông tin nào!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
          <div>
            <h3 className="text-white font-semibold mb-2">HỖ TRỢ KHÁCH HÀNG</h3>
            <p>Hướng dẫn mua hàng trực tuyến</p>
            <p>Hướng dẫn thanh toán</p>
            <p>Gửi yêu cầu khiếu nại</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">CHÍNH SÁCH</h3>
            <p>Chính sách quy định chung</p>
            <p>Chính sách vận chuyển</p>
            <p>Chính sách bảo hành</p>
            <p>Chính sách chi doanh nghiệp</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">THÔNG TIN KHUYẾN MÃI</h3>
            <p>Thông tin khuyến mãi</p>
            <p>Sản phẩm bán chạy</p>
            <p>Sản phẩm mới</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
