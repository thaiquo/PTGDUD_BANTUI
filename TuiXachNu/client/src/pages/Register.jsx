import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "/src/assets/Logo.jpg";  // thay đúng path logo của bạn

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    try {
      const checkResponse = await fetch(`http://localhost:3001/users?username=${username}`);
      const existingUsers = await checkResponse.json();

      if (existingUsers.length > 0) {
        setError('Tên đăng nhập đã tồn tại');
        return;
      }

      const newUser = { username, email, password, roles: ['user'] };
      const response = await fetch(`http://localhost:3001/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        setError('Đăng ký thất bại');
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
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">Tạo Tài Khoản Mới</h2>
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
            <input
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
              type="submit"
            >
              Đăng Ký
            </button>
            <button
              type="button"
              className="text-sm text-red-500 hover:text-red-700"
              onClick={() => navigate('/login')}
            >
              Đã có tài khoản? Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
