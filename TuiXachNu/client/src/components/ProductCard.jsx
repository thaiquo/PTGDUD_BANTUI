import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate(); // Kết hợp useNavigate

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Parse giá tiền gốc
  const rawGiaTien = product.giaTien || "0";
  const cleanedGia = Number(rawGiaTien.replace(/[₫,]/g, ""));
  const salePrice = Math.round(cleanedGia * 0.9);

  // Lấy hình ảnh màu sắc đầu tiên
  const firstColor = product.mauSac?.[0];
  const imageUrl = firstColor?.hinhAnh?.[0]?.img || "";

  // Kiểm tra trạng thái sale
  const isOnSale = product.trangThai === 0;

  return (
    <div
  onClick={handleClick}
  className="cursor-pointer border rounded-2xl overflow-hidden shadow-md p-4 bg-white hover:shadow-lg transition relative w-full max-w-[250px] h-[320px] flex flex-col justify-between"
>
  {/* Ảnh */}
  <div className="flex justify-center items-center h-[180px] mb-4 rounded" id="hinhanh">
    <img
      src={imageUrl || "/placeholder.jpg"} // Đảm bảo hình ảnh fallback nếu không có imageUrl
      alt={product.tenSanPham}
      className="max-h-full max-w-full object-contain transition-transform hover:scale-105"
    />
  </div>

  {/* Tên sản phẩm */}
  <h2 className="text-base font-semibold mb-2 line-clamp-2 h-[48px] text-gray-800">
    {product.tenSanPham}
  </h2>

  {/* Giá tiền */}
  <div className="flex justify-between items-center mb-2">
    {isOnSale ? (
      <>
        <span className="text-red-600 font-bold text-base">
          {salePrice.toLocaleString()}₫
        </span>
        <span className="text-gray-500 line-through text-sm">
          {cleanedGia.toLocaleString()}₫
        </span>
      </>
    ) : (
      <span className="text-gray-800 font-semibold text-base">
        {cleanedGia.toLocaleString()}₫
      </span>
    )}
  </div>

  {/* Nhãn FLASH SALE */}
  {isOnSale && (
    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow">
      FLASH SALE
    </span>
  )}
</div>
  );
};

export default ProductCard;

