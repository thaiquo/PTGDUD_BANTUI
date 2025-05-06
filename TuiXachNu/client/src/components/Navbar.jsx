import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import menuData from "../../data/menu.json";
import logo from "../assets/Logo.jpg";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUser));
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  }, []);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      navigate("/user"); // Hiển thị UserProfile
    } else {
      navigate("/login"); // Chuyển tới trang đăng nhập
    }
  };


  return (
    <div className="bg-white shadow z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src={logo}
            alt="TNQ Store Logo"
            className="h-15 w-40 object-contain transition-transform duration-300 hover:scale-105 hover:rotate-1"
          />
        </div>

        {/* Menu */}
        <ul className="flex space-x-8 font-medium text-gray-700">
          {menuData.menu.map((item, index) => (
            <li
              key={index}
              className="relative"
              onMouseEnter={() => item.submenu && setActiveIndex(index)}
              onMouseLeave={() => item.submenu && setActiveIndex(null)}
            >
              <span
                className={`cursor-pointer hover:text-red-500 ${
                  activeIndex === index ? "text-red-500" : ""
                }`}
              >
                {item.title}
              </span>

              {item.submenu && activeIndex === index && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-[700px] bg-white shadow-lg p-6 flex justify-between z-50 transition-all duration-300 ease-in-out opacity-100 translate-y-2">
                  {item.submenu.map((col, i) => (
                    <div key={i}>
                      <h4 className="font-semibold mb-2">{col.category}</h4>
                      <ul className="space-y-1 text-sm">
                        {col.items.map((subItem, j) => (
                          <li
                            key={j}
                            className="hover:text-red-500 cursor-pointer"
                          >
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

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Search box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-2 top-1.5 text-gray-500" />
          </div>

          {/* User icon */}
          <div className="relative">
            <UserIcon
              onClick={handleUserIconClick}
              className="h-6 w-6 text-gray-700 hover:text-red-500 cursor-pointer"
            />
            {isLoggedIn && userData && (
              <span className="text-sm ml-1">{userData.username}</span>
            )}
         
          </div>

          {/* Cart icon */}
          <ShoppingBagIcon className="h-6 ms-5 w-6 text-gray-700 hover:text-red-500 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
