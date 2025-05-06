"use client"

import { useState, useEffect } from "react"
import { MagnifyingGlassIcon, ShoppingBagIcon, UserIcon } from "@heroicons/react/24/outline"
import menuData from "../../data/menu.json"
import logo from "../assets/Logo.jpg"
import { Link, useNavigate } from "react-router-dom"

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(null)
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setIsLoggedIn(true)
      setUserData(JSON.parse(storedUser))
    } else {
      setIsLoggedIn(false)
      setUserData(null)
    }

    // Lấy số lượng sản phẩm trong giỏ hàng từ localStorage
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        const count = cart.reduce((total, item) => total + item.soLuong, 0)
        setCartCount(count)
      } catch (error) {
        console.error("Lỗi khi đọc giỏ hàng:", error)
        setCartCount(0)
      }
    }

    updateCartCount()

    // Lắng nghe sự kiện storage để cập nhật số lượng giỏ hàng khi có thay đổi
    window.addEventListener("storage", updateCartCount)

    return () => {
      window.removeEventListener("storage", updateCartCount)
    }
  }, [])

  // Cập nhật số lượng giỏ hàng mỗi khi component được render lại
  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      const count = cart.reduce((total, item) => total + item.soLuong, 0)
      setCartCount(count)
    } catch (error) {
      console.error("Lỗi khi đọc giỏ hàng:", error)
    }
  })

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      navigate("/user")
    } else {
      navigate("/login")
    }
  }

  return (
    <div className="bg-white shadow z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img
              src={logo || "/placeholder.svg"}
              alt="TNQ Store Logo"
              className="h-15 w-40 object-contain transition-transform duration-300 hover:scale-105 hover:rotate-1"
            />
          </Link>
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
              {item.link ? (
                <Link
                  to={item.link}
                  className={`cursor-pointer hover:text-red-500 ${activeIndex === index ? "text-red-500" : ""}`}
                >
                  {item.title}
                </Link>
              ) : (
                <span className={`cursor-pointer hover:text-red-500 ${activeIndex === index ? "text-red-500" : ""}`}>
                  {item.title}
                </span>
              )}

              {item.submenu && activeIndex === index && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-[700px] bg-white shadow-lg p-6 flex justify-between z-50 transition-all duration-300 ease-in-out opacity-100 translate-y-2">
                  {item.submenu.map((col, i) => (
                    <div key={i}>
                      <h4 className="font-semibold mb-2">{col.category}</h4>
                      <ul className="space-y-1 text-sm">
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
            {isLoggedIn && userData && <span className="text-sm ml-1">{userData.username}</span>}
          </div>

          {/* Cart icon */}
          <Link to="/cart" className="relative">
            <ShoppingBagIcon className="h-6 w-6 text-gray-700 hover:text-red-500 cursor-pointer" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar
