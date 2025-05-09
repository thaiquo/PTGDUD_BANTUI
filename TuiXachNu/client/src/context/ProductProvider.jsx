"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(null);
  const [cart, setCart] = useState([]);

  // Base API URL
  const API_BASE =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://ptgdud-bantui.onrender.com";

  const apiURL = `${API_BASE}/api/db.json`;

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        console.log("User loaded from localStorage:", parsedUser.username);
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Fetch product + banner data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(apiURL);
        const data = res.data?.[0] || {};

        setProducts(data.sanpham || []);
        setBanner(data.banner || []);
        setError(null);
      } catch (err) {
        setError(`❌ Không thể lấy dữ liệu sản phẩm: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiURL]);

  // Login
  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE}/api/login`, credentials);
      if (response.status === 200 && response.data) {
        setCurrentUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        setAuthError(null);
        await fetchCart();
        return { success: true, user: response.data };
      } else {
        setAuthError(response.data?.error || "Đăng nhập không thành công.");
        return { success: false, message: response.data?.error || "Đăng nhập không thành công." };
      }
    } catch (err) {
      setAuthError(`❌ Lỗi đăng nhập: ${err.response?.data?.error || err.message}`);
      return { success: false, message: err.response?.data?.error || "Đã có lỗi xảy ra khi đăng nhập." };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    localStorage.removeItem("user");
  };

  // Register
  const register = async (newUser) => {
    try {
      const response = await axios.post(`${API_BASE}/api/register`, newUser);
      setRegisterSuccess(response.data.message);
      setAuthError(null);
      return { success: true, message: response.data.message };
    } catch (err) {
      setRegisterSuccess(null);
      setAuthError(`❌ ${err.response?.data?.error || "Lỗi kết nối đến server"}`);
      return { success: false, message: err.response?.data?.error || "Lỗi kết nối đến server" };
    }
  };

  // Fetch Cart
  const fetchCart = async () => {
    if (!currentUser) return [];
    try {
      const res = await axios.get(`${API_BASE}/api/cart/${currentUser.id}`);
      setCart(res.data.cart || []);
      return res.data.cart || [];
    } catch (err) {
      console.error("❌ Lỗi tải giỏ hàng:", err);
      setCart([]);
      return [];
    }
  };

  // Add to Cart
  const addToCart = async (cartItem) => {
    if (!currentUser) {
      return { success: false, message: "Vui lòng đăng nhập để thêm vào giỏ hàng." };
    }
    try {
      const simplifiedCartItem = {
        idProduct: String(cartItem.idProduct),
        quantity: Number(cartItem.quantity),
      };
      const response = await axios.post(`${API_BASE}/api/addtocart/${currentUser.id}`, simplifiedCartItem);
      await fetchCart();
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng.",
      };
    }
  };

  // Remove from Cart
  const removeFromCart = async (productId) => {
    if (!currentUser) return { success: false, message: "Vui lòng đăng nhập để xóa khỏi giỏ hàng." };
    try {
      const response = await axios.delete(`${API_BASE}/api/deletecart/${currentUser.id}`, {
        data: { idProduct: productId },
      });
      await fetchCart();
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi khi xóa khỏi giỏ hàng.",
      };
    }
  };

  // Update Cart Quantity
  const updateCartQuantity = async (productId, quantity) => {
    if (!currentUser) return { success: false, message: "Vui lòng đăng nhập để cập nhật giỏ hàng." };
    try {
      const response = await axios.put(`${API_BASE}/api/updatecart/${currentUser.id}`, {
        idProduct: productId,
        quantity: Number.parseInt(quantity, 10),
      });
      await fetchCart();
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi khi cập nhật giỏ hàng.",
      };
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    if (!currentUser) return [];
    try {
      const res = await axios.get(`${API_BASE}/api/orders/${currentUser.id}`);
      return res.data.orders || [];
    } catch (err) {
      console.error("❌ Lỗi tải lịch sử đơn hàng:", err);
      return [];
    }
  };

  // Sync cart when login
  useEffect(() => {
    if (currentUser) {
      fetchCart();
    }
  }, [currentUser]);

  return (
    <ProductContext.Provider
      value={{
        products,
        banner,
        loading,
        error,
        currentUser,
        authError,
        registerSuccess,
        login,
        logout,
        register,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        fetchCart,
        fetchOrders,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
