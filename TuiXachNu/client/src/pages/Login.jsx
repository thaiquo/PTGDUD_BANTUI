"use client";
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductProvider';
import logo from "/src/assets/Logo.jpg";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login, currentUser, authError } = useContext(ProductContext); // Vẫn sử dụng login và authError

    const handleSubmit = async (event) => {
        event.preventDefault();

        const result = await login({ username, password }); // Gọi hàm login

        if (result?.success && result?.user) {
            localStorage.setItem('user', JSON.stringify(result.user));
            navigate('/user');
        }
        // authError sẽ được hiển thị nếu đăng nhập không thành công (nếu server trả về lỗi có message)
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-100 via-white to-pink-100">
            <div className="bg-white shadow-lg rounded-lg px-10 pt-10 pb-8 w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <img src={logo} alt="Logo" className="h-16 w-40 object-contain" />
                    <h2 className="text-2xl font-semibold text-gray-800 mt-4">Đăng Nhập Tài Khoản</h2>
                </div>
                {authError && <p className="text-red-500 text-sm mb-4 text-center">{authError}</p>} {/* Vẫn hiển thị authError */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                        <input
                            className="w-full border rounded-md py-2 px-3"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                        <input
                            className="w-full border rounded-md py-2 px-3"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded" type="submit">
                            Đăng Nhập
                        </button>
                        <button
                            type="button"
                            className="text-sm text-red-500 hover:text-red-700"
                            onClick={() => navigate('/register')}
                        >
                            Chưa có tài khoản? Đăng ký
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Login;