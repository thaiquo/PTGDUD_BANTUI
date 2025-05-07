import React from "react";

const ProductCard = ({ product }) => {
  const rawGiaTien = product.giaTien || "0";
  const cleanedGia = Number(rawGiaTien.replace(/[₫,]/g, ""));
  const salePrice = Math.round(cleanedGia * 0.9);

  const firstColor = product.mauSac?.[0];
  const imageUrl = firstColor?.hinhAnh?.[0]?.img || "";

  return (
    <div className="border rounded-2xl overflow-hidden shadow-md p-4 bg-white hover:shadow-lg transition relative w-full max-w-[250px] h-[320px] flex flex-col justify-between">
      <div className="flex justify-center items-center h-[180px] mb-4">
        <img
          src={imageUrl}
          alt={product.tenSanPham}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <h2 className="text-base font-semibold mb-2 line-clamp-2 h-[48px]">
        {product.tenSanPham}
      </h2>

      <div className="flex justify-between items-center mb-2">
        <span className="text-red-600 font-bold text-base">
          {salePrice.toLocaleString()}₫
        </span>
        <span className="text-gray-500 line-through text-sm">
          {cleanedGia.toLocaleString()}₫
        </span>
      </div>

      <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
        FLASH SALE
      </span>
    </div>
  );
};

export default ProductCard;
