import Navbar from "./components/Navbar";
 import "./App.css";
 // Giả sử bạn có component này


 import { BrowserRouter, Routes, Route } from "react-router-dom";
 import TrangChu from "./pages/TrangChu"
 import Login from "./pages/Login"
 import Register from "./pages/Register"
 import UserProfile from "./components/UserProfile"
 import ProductDetail from "./pages/ProductDetail"
 import Cart from "./pages/Cart"
 import Checkout from "./components/Checkout"
 
 function App() {
   return (
     
 
       <Routes>
         <Route path="/" element={<TrangChu />} />
         <Route path="/login" element={<Login />} />
         <Route path="/product/:id" element={<ProductDetail />} />
         <Route path="/register" element={<Register />} />
         <Route path="/user" element={<UserProfile />} /> {/* Trang hồ sơ người dùng */}
         <Route path="/user" element={<UserProfile />} />
         <Route path="/cart" element={<Cart />} />
         <Route path="/checkout" element={<Checkout />} />
       </Routes>
     
   );
   
 }
 
 export default App;