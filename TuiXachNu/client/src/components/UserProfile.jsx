// client/src/pages/UserProfile.jsx
"use client"

import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ProductContext } from "../context/ProductProvider"
import { ShoppingBagIcon, HomeIcon } from "@heroicons/react/24/outline" // Import HomeIcon
import PageTransition from "./PageTransition"

function UserProfile() {
    const { currentUser, logout } = useContext(ProductContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!currentUser) {
            navigate("/login")
        }
    }, [currentUser, navigate])

    if (!currentUser) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Đang tải...</p>
            </div>
        )
    }

    return (
        <PageTransition>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">Thông Tin Người Dùng</h2>
                    <p className="text-gray-600">Thông tin chi tiết về hồ sơ của bạn.</p>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <span className="font-semibold text-gray-700">Tên đăng nhập:</span>
                        <p className="text-gray-900">{currentUser.username}</p>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-700">Email:</span>
                        <p className="text-gray-900">{currentUser.email}</p>
                    </div>
                    {currentUser.roles && (
                        <div>
                            <span className="font-semibold text-gray-700">Quyền:</span>
                            <ul className="list-disc list-inside text-gray-900">
                                {currentUser.roles.map((role, i) => (
                                    <li key={i}>{role}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Nút Về Trang Chủ */}
                    <button
                        onClick={() => navigate("/")}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center">
                            <HomeIcon className="h-5 w-5 text-blue-500 mr-2" /> {/* Sử dụng HomeIcon */}
                            <span>Về Trang Chủ</span>
                        </div>
                        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Nút để mở trang lịch sử mua hàng */}
                   {/* Nút để mở trang lịch sử mua hàng */}
                  <button
    onClick={() => navigate("/order-history")}
    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
>
    <div className="flex items-center">
        <ShoppingBagIcon className="h-5 w-5 text-red-500 mr-2" />
        <span>Lịch Sử Mua Hàng</span>
    </div>
    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
                  </button>

                    <button
                        onClick={logout}
                        className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
        </PageTransition>
    )
}

export default UserProfile