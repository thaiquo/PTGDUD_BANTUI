import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Thông Tin Người Dùng</h2>
          <p className="text-gray-600">Thông tin chi tiết về hồ sơ của bạn.</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Tên đăng nhập:</span>
            <p className="text-gray-900">{user.username}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Email:</span>
            <p className="text-gray-900">{user.email}</p>
          </div>
          {user.roles && (
            <div>
              <span className="font-semibold text-gray-700">Quyền:</span>
              <ul className="list-disc list-inside text-gray-900">
                {user.roles.map((role, i) => (
                  <li key={i}>{role}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Về Trang Chủ
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
