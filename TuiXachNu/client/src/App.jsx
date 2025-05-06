import Navbar from "./components/Navbar";
import "./App.css";
// Giả sử bạn có component này
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TrangChu from "./pages/TrangChu";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<TrangChu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<UserProfile />} /> {/* Trang hồ sơ người dùng */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;