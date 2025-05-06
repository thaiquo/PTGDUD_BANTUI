import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "/src/assets/Logo.jpg"; // thay đúng path logo của bạn

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(`http://localhost:3001/users?username=${username}&password=${password}`);
      const users = await response.json();

      if (users.length > 0) {
        const user = users[0];
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/user');
      } else {
        setError('Sai tên đăng nhập hoặc mật khẩu');
      }
    } catch (err) {
      console.error('Lỗi kết nối:', err);
      setError('Không thể kết nối đến máy chủ');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-100 via-white to-pink-100">
      <div className="bg-white shadow-lg rounded-lg px-10 pt-10 pb-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="TNQ Store Logo"
            className="h-16 w-40 object-contain transition-transform duration-300 hover:scale-105 hover:rotate-1"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">Đăng Nhập Tài Khoản</h2>
        </div>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
            <input
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
              type="submit"
            >
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
