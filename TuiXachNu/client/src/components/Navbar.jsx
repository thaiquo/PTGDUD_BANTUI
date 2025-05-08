"use client"

import { useState, useEffect, useContext } from "react";
import { MagnifyingGlassIcon, ShoppingBagIcon, UserIcon } from "@heroicons/react/24/outline";
import logo from "../assets/Logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { ProductContext } from "../context/ProductProvider";  // ← import context

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useContext(ProductContext);        // ← lấy currentUser

  const [cartCount, setCartCount] = useState(0);

  const menu = [
    { title: "Trang chủ", link: "/" },
    {
      title: "Sản Phẩm",
      submenu: [
        { category: "LOẠI TÚI", items: ["Túi xách tay", "Túi đeo chéo", "Túi đeo vai", "Túi mini", "Túi tote"] },
        { category: "CHẤT LIỆU", items: ["Da tổng hợp", "Vải canvas", "Da lộn", "Nhựa trong suốt"] },
        { category: "PHONG CÁCH", items: ["Công sở", "Dạo phố", "Dự tiệc", "Du lịch"] }
      ]
    },
    { title: "Sale", link: "/sale" },
    { title: "Hỗ trợ", link: "/support" }
  ];

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.reduce((total, item) => total + item.soLuong, 0));
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  // ← chuyển sang dùng currentUser
  const handleUserIconClick = () => {
    navigate(currentUser ? "/user" : "/login");
  };

  const handleMouseEnter = (index) => {
    clearTimeout(hoverTimeout);
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverTimeout(setTimeout(() => setActiveIndex(null), 1000));
  };

  return (
    <div className="bg-white shadow z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/"><img src={logo} alt="TNQ Store Logo" className="h-15 w-40 object-contain" /></Link>

        <ul className="flex space-x-8 font-medium text-gray-700">
          {menu.map((item, index) => (
            <li
              key={index}
              className="relative"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <Link to={item.link || "#"} className={activeIndex === index ? "text-red-500" : ""}>
                {item.title}
              </Link>
              {item.submenu && activeIndex === index && (
                <div className="absolute left-0 top-full w-[700px] bg-white shadow-lg p-4 flex z-50">
                  {item.submenu.map((col, i) => (
                    <div key={i} className="px-4">
                      <h4 className="font-semibold mb-2">{col.category}</h4>
                      <ul>
                        {col.items.map((subItem, j) => (
                          <li key={j} className="hover:text-red-500 cursor-pointer">
                            {subItem}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-1 rounded-md border focus:ring-red-400"
            />
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-2 top-1.5 text-gray-500" />
          </div>

          <UserIcon
            onClick={handleUserIconClick}
            className="h-6 w-6 text-gray-700 hover:text-red-500 cursor-pointer"
          />
          {/* Hiển thị tên nếu đã login */}
          {currentUser && <span className="text-sm ml-1">{currentUser.username}</span>}

          <Link to="/cart" className="relative">
            <ShoppingBagIcon className="h-6 w-6 text-gray-700 hover:text-red-500" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
