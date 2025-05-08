import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import TrangChu from "./pages/TrangChu"
import Login from "./pages/Login"
import Register from "./pages/Register"
import UserProfile from "./components/UserProfile"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Checkout from "./components/Checkout"
import Products from "./pages/Products"
import OrderHistory from "./pages/OderHistory"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TrangChu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/productList" element={<Products />} />
        <Route path="/order-history" element={<OrderHistory />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
