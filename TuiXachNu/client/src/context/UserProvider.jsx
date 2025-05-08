import React, { createContext, useState } from 'react';
import axios from 'axios';

// Tạo context
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  const apiURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api/db.json' 
    : 'https://ptgud-tv-store-react.onrender.com/users';

  const login = async (username, password) => {
    try {
      const response = await axios.get(`${apiURL}?username=${username}&password=${password}`);
      if (response.data.length > 0) {
        const user = response.data[0];
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        setAuthError(null);
        return true;
      } else {
        setAuthError("Sai tên đăng nhập hoặc mật khẩu");
        return false;
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      setAuthError("Không thể kết nối đến máy chủ");
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout, authError }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
