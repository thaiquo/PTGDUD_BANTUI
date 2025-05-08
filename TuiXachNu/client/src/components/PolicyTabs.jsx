import React, { useState } from 'react';

const tabs = ['Chính sách đổi trả', 'Hướng dẫn bảo quản'];

const PolicyTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="max-w-4xl w-4/5 ml-12 px-4"> {/* Set width to 40% of the parent */}
    {/* Tabs */}
    <div className="flex border-b border-gray-300 text-sm font-semibold text-gray-800">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(index)}
          className={`py-2 px-4 ${
            activeTab === index
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500'
          }`}
        >
          <p className="font-bold text-2xl">{tab}</p>
        </button>
      ))}
    </div> 

      {/* Content */}
      <div className="mt-6 text-lg leading-relaxed text-gray-700"> {/* Increased text size */}
        {activeTab === 0 ? (
          <div>
            <p className="mb-2">
              <strong>Chính sách Đổi/Trả tại TNQ Store</strong>
            </p>
            <p className="mb-2">
              TNQ Store – cửa hàng túi xách trực tuyến của nhóm sinh viên – hiện đang áp dụng chính sách đổi/trả như sau:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>⏳ Đổi/trả trong vòng <strong>30 ngày</strong> kể từ ngày nhận hàng, áp dụng với các sản phẩm <strong>túi xách nguyên giá</strong>.</li>
              <li>🏷️ Đổi/trả trong vòng <strong>7 ngày</strong> đối với các sản phẩm <strong>khuyến mãi</strong>.</li>
              <li>🛠️ Chỉ hỗ trợ đổi/trả trong trường hợp <strong>sản phẩm bị lỗi sản xuất</strong>.</li>
              <li>❌ Vì là cửa hàng online do sinh viên vận hành, hiện <strong>chưa hỗ trợ đổi/trả tại cửa hàng trực tiếp</strong>. Mong các bạn thông cảm và tiếp tục ủng hộ tụi mình nhé!</li>
            </ul>
            <p className="mt-4">
              📎 Xem thêm chi tiết tại: 👉 <a href="#" className="text-blue-600 underline">Chính sách đổi trả đầy đủ</a>
            </p>
          </div>
        ) : (
          <div>
            <p className="mb-4 font-medium">Hướng dẫn bảo quản túi xách:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Đặt túi trên bề mặt sạch, tránh để nơi ẩm thấp hoặc bụi bẩn.</li>
              <li>Không treo túi bằng quai quá lâu để tránh hỏng dáng/quai.</li>
              <li>Tránh ánh nắng mặt trời trực tiếp trong thời gian dài.</li>
              <li>Không để vật sắc nhọn hoặc dễ lem màu vào trong túi.</li>
              <li>Lau túi bằng khăn khô, tránh dùng cồn, nước hoặc chất tẩy mạnh.</li>
              <li>Không giặt túi hoặc làm khô bằng nhiệt độ cao.</li>
              <li>Nhét giấy/túi nilon vào giữ form, cất túi trong bao hoặc tủ kín.</li>
              <li>Dùng gói hút ẩm để hạn chế mùi hôi và ẩm mốc.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyTabs;
