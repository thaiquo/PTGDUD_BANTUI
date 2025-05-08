"use client"
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

  // API base URL
  const API_BASE =
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://ptgud-tv-store-react.onrender.com";

  const apiURL = `${API_BASE}/api/db.json`;

  // Check for logged in user on initial load
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

  // --- Load sản phẩm ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log("Fetching products from:", apiURL);
        const response = await axios.get(apiURL);
        if (Array.isArray(response.data) && response.data.length > 0) {
          const data = response.data[0];
          setProducts(data.sanpham || []);
          setBanner(data.banner || []);
          console.log(`Loaded ${data.sanpham?.length || 0} products`);
          setError(null);
        } else {
          setError("Dữ liệu không hợp lệ hoặc không có sản phẩm");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(`❌ Không thể lấy dữ liệu sản phẩm: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [apiURL]);

  // --- Đăng nhập ---
  const login = async (credentials) => {
    try {
      console.log("Logging in with credentials:", { ...credentials, password: "***" });
      const response = await axios.post(`${API_BASE}/api/login`, credentials);
      if (response.status === 200 && response.data) {
        console.log("Login successful:", response.data.username);
        setCurrentUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        setAuthError(null);
        await fetchCart();
        return { success: true, user: response.data };
      } else {
        console.log("Login failed:", response.data);
        setAuthError(response.data?.error || "Đăng nhập không thành công.");
        return { success: false, message: response.data?.error || "Đăng nhập không thành công." };
      }
    } catch (err) {
      console.error("Login error:", err);
      setAuthError(`❌ Lỗi đăng nhập: ${err.response?.data?.error || err.message}`);
      return { success: false, message: err.response?.data?.error || "Đã có lỗi xảy ra khi đăng nhập." };
    }
  };

  const logout = () => {
    console.log("Logging out");
    setCurrentUser(null);
    setCart([]);
    localStorage.removeItem("user");
  };

  // --- Đăng ký ---
  const register = async (newUser) => {
    try {
      console.log("Registering new user:", { ...newUser, password: "***" });
      const response = await axios.post(`${API_BASE}/api/register`, newUser);
      console.log("Registration response:", response.data);
      setRegisterSuccess(response.data.message);
      setAuthError(null);
      return { success: true, message: response.data.message };
    } catch (err) {
      console.error("Registration error:", err);
      setRegisterSuccess(null);
      setAuthError(`❌ ${err.response?.data?.error || "Lỗi kết nối đến server"}`);
      return { success: false, message: err.response?.data?.error || "Lỗi kết nối đến server" };
    }
  };

  // --- Giỏ hàng ---
  const fetchCart = async () => {
    if (!currentUser) return [];
    try {
      console.log(`Fetching cart for user ID: ${currentUser.id}`);
      const res = await axios.get(`${API_BASE}/api/cart/${currentUser.id}`);
      console.log("Cart data received:", res.data);
      setCart(res.data.cart || []);
      return res.data.cart || [];
    } catch (err) {
      console.error("❌ Lỗi tải giỏ hàng:", err);
      console.error("Error details:", err.response?.data || err.message);
      setCart([]);
      return [];
    }
  };

  const addToCart = async (cartItem) => {
    if (!currentUser) {
      console.warn("User not logged in, cannot add to cart.");
      return { success: false, message: "Vui lòng đăng nhập để thêm vào giỏ hàng." };
    }
    try {
      console.log(`Adding to cart - userId: ${currentUser.id}, item:`, cartItem);

      // Simplify the cart item to only include what the server needs
      const simplifiedCartItem = {
        idProduct: String(cartItem.idProduct),
        quantity: Number(cartItem.quantity),
      };

      console.log("Sending to server:", simplifiedCartItem);

      const response = await axios.post(`${API_BASE}/api/addtocart/${currentUser.id}`, simplifiedCartItem);

      console.log("Add to cart response:", response.data);
      await fetchCart();
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      console.error("Error details:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng.",
      };
    }
  };

  const removeFromCart = async (productId) => {
    if (!currentUser) return { success: false, message: "Vui lòng đăng nhập để xóa khỏi giỏ hàng." };
    try {
      console.log(`Removing from cart - userId: ${currentUser.id}, productId: ${productId}`);

      const response = await axios.delete(`${API_BASE}/api/deletecart/${currentUser.id}`, {
        data: { idProduct: productId },
      });

      console.log("Remove from cart response:", response.data);
      await fetchCart();
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("❌ Error removing from cart:", error);
      console.error("Error details:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi khi xóa khỏi giỏ hàng.",
      };
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (!currentUser) return { success: false, message: "Vui lòng đăng nhập để cập nhật giỏ hàng." };
    try {
      console.log(`Updating cart - userId: ${currentUser.id}, productId: ${productId}, quantity: ${quantity}`);

      const response = await axios.put(`${API_BASE}/api/updatecart/${currentUser.id}`, {
        idProduct: productId,
        quantity: Number.parseInt(quantity, 10),
      });

      console.log("Update cart response:", response.data);
      await fetchCart();
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("❌ Error updating cart:", error);
      console.error("Error details:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi khi cập nhật giỏ hàng.",
      };
    }
  };

  // --- Lịch sử đơn hàng ---
  const fetchOrders = async () => {
    if (!currentUser) return [];
    try {
      console.log(`Fetching orders for user ID: ${currentUser.id}`);
      const res = await axios.get(`${API_BASE}/api/orders/${currentUser.id}`);
      console.log("Orders data received:", res.data);
      return res.data.orders || [];
    } catch (err) {
      console.error("❌ Lỗi tải lịch sử đơn hàng:", err);
      console.error("Error details:", err.response?.data || err.message);
      return [];
    }
  };

  // --- Đồng bộ khi user đăng nhập ---
  useEffect(() => {
    if (currentUser) {
      console.log("User logged in, fetching cart");
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
        fetchOrders, // Add fetchOrders to context
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;