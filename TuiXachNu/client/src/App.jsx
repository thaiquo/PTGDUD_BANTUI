import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import TrangChu from "./pages/TrangChu"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import ProductSales from "./pages/ProductSales"
import Products from "./pages/Products"
import ProductSearch from "./pages/ProductSearch"
import News from "./pages/news"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TrangChu />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/product/:id" element={<ProductDetail key={window.location.pathname} />} />
        {/* <Route path="/register" element={<Register />} />
        <Route path="/user" element={<UserProfile />} /> */}
        <Route path="/cart" element={<Cart />} />
        {/* <Route path="/checkout" element={<Checkout />} /> */}
        <Route path="/productList" element={<Products />} />
        <Route path="/productSales" element={<ProductSales/>}></Route>
        <Route path="/product-search" element={<ProductSearch />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App