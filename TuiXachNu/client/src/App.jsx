import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import TrangChu from "./pages/TrangChu"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import ProductSales from "./pages/ProductSales"
import Products from "./pages/Products"
import OrderHistory from "./pages/OderHistory"
import ProductSearch from "./pages/ProductSearch"
import News from "./pages/news"
import Checkout from "./components/Checkout"
import UserProfile from "./components/UserProfile"
import Register from "./pages/Register"
import Login from "./pages/Login"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TrangChu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail key={window.location.pathname} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/productList" element={<Products />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/productSales" element={<ProductSales />} />
        <Route path="/product-search" element={<ProductSearch />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
