import React from 'react';
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import Footer from "../components/Footer";

const News = () => {
  const newsList = [
    {
      title: 'Gợi ý thời trang và tips làm đẹp khi đi làm ngày nắng',
      date: 'Thời trang 14/03/2024',
      imageUrl: 'https://ss-images.saostar.vn/w400/2024/3/8/pc/1709867334430/8mjkt450481-aid04ut6lh2-fj6nktsnfk3.jpg',
      link: 'https://www.saostar.vn/thoi-trang/goi-y-thoi-trang-va-tips-lam-dep-khi-di-lam-ngay-nang-202403141659356898.html',
    },
    {
      title: 'Muốn sành điệu như gái Hàn, chị em tậu ngay 3 phụ kiện đắt giá này cho 8/3 đi!',
      date: 'Thời trang 14/03/2024',
      imageUrl: 'https://ss-images.saostar.vn/w400/pc/1646578428483/saostar-0lc9bofec1zu8kso.jpg',
      link: 'https://www.saostar.vn/thoi-trang/sanh-dieu-nhu-gai-han-phai-tia-ngay-3-phu-kien-dat-gia-trong-ngay-8-3-202203071122078383.html',
    },
    {
      title: 'Bí ẩn tủ đồ Hoàng gia: Tại sao phụ nữ hoàng gia luôn cầm theo túi xách?',
      date: 'Thời trang 16/03/2024',
      imageUrl: 'https://ss-images.saostar.vn/wwebp400/pc/1609854400055/queen-elizabeth-ii-rfeaster0417.jpg',
      link: 'https://www.saostar.vn/thoi-trang/tai-sao-phu-nu-hoang-gia-luon-cam-theo-tui-xach-20210105204841910.html',
    },
    {
      title: 'Hot Trends Túi nơ thống trị xu hướng, nhìn thú vị thế nào mà "lấy lòng" được Han So Hee và Jennie',
      date: 'Thời trang 16/02/2024',
      imageUrl: 'https://kenh14cdn.com/zoom/279_174/203336854389633024/2024/3/18/photo1710770011656-1710770012109947079551.png',
      link: 'https://kenh14.vn/tui-no-thong-tri-xu-huong-nhin-thu-vi-the-nao-ma-lay-long-duoc-han-so-hee-va-jennie-2024031820552875.chn',
    },
    {
      title: '4 mẫu túi xách tiện lợi, thời trang bạn có thể mang đi chơi và đi du lịch',
      date: 'Thời trang 16/02/2024',
      imageUrl: 'https://kenh14cdn.com/zoom/279_174/203336854389633024/2023/11/13/photo1699843457796-16998434579491498290660.jpg',
      link: 'https://kenh14.vn/4-mau-tui-xach-tien-loi-thoi-trang-ban-co-the-mang-di-choi-va-di-du-lich-20231113094749296.chn',
    },
  ];

  return (
    <PageTransition>
      <Navbar />
      <div className="container mx-auto mt-8" style={{ width: '80%' }}>
        <h5 className="text-gray-500 mb-6">TNQ Store cập nhật tin tức, sự kiện, hình ảnh, video clip hot nhất 24h về TÚI XÁCH NỮ</h5>
        <div className="space-y-8">
          {newsList.map((news, index) => (
            <div key={index} className="flex items-start">
              <div className="w-2/3 pr-4">
                <a href={news.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  <p className="text-lg font-bold">{news.title}</p>
                </a>
                <span className="text-gray-500 text-sm">{news.date}</span>
              </div>
              <div className="w-1/3">
                <a href={news.link} target="_blank" rel="noopener noreferrer">
                  <img className="w-full h-auto object-cover" src={news.imageUrl} alt={news.title} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

export default News;
