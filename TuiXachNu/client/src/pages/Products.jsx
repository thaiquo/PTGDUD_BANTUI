import React, { useContext, useState, useMemo } from 'react';
import { ProductContext } from '../context/ProductProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Products = () => {
    const { products, loading, error } = useContext(ProductContext);
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const parsePrice = (priceStr) => {
        if (!priceStr) return 0;
        return Number(priceStr.replace(/[₫,.]/g, '').trim());
    };

    // Sắp xếp sản phẩm theo giá
    const sortedProducts = useMemo(() => {
        return [...products].sort((a, b) => {
            const priceA = parsePrice(a.giaTien);
            const priceB = parsePrice(b.giaTien);
            return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
        });
    }, [products, sortOrder]);

    // Tổng số trang
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

    // Lấy danh sách sản phẩm cho trang hiện tại
    const currentProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedProducts, currentPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) return <div>Đang tải sản phẩm...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
        <Navbar/>
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Top Sản Phẩm Mới Nhất</h2>
                <select
                    value={sortOrder}
                    onChange={(e) => {
                        setSortOrder(e.target.value);
                        setCurrentPage(1); // reset về trang đầu khi thay đổi sắp xếp
                    }}
                    className="border border-gray-300 rounded px-3 py-2"
                >
                    <option value="asc">Giá tăng dần</option>
                    <option value="desc">Giá giảm dần</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                    <div key={product.id} className="border rounded p-4 hover:shadow-lg transition relative">
                    {/* Nếu sản phẩm đang sale, hiển thị nhãn SALE */}
                    {product.trangThai === 0 && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        SALE
                      </div>
                    )}
                  
                    <div className="flex justify-center items-center h-[180px] mb-4">
                      <img
                        src={product.mauSac[0]?.hinhAnh[0]?.img}
                        alt={product.tenSanPham}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                        <h3
                        className="text-lg font-semibold mb-2 overflow-hidden"
                        style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '4.5em', // ~ 3 dòng với line-height mặc định
                            }}
                            >
                            {product.tenSanPham}
                        </h3>
                    {/* Giá tiền */}
                    <div className="flex justify-center gap-3 items-center mt-2">
                    {product.trangThai === 0 ? (
                         <>
                 <span className="text-red-600 font-bold">
                    {(
                     parsePrice(product.giaTien) * 0.9
                     ).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                    <span className="text-gray-500 line-through">
                     {product.giaTien}
                     </span>
                         </>
                    ) : (
                    <span className="text-red-600 font-bold">{product.giaTien}</span>
                        )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Phân trang */}
            <div className="flex justify-center mt-8 space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-4 py-2 border rounded ${
                            currentPage === i + 1 ? 'bg-black text-white' : ''
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Tiếp
                </button>
            </div>
        </div>
        <Footer/>
        </>
        
    );
};

export default Products;
