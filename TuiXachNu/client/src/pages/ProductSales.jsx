// import { Link } from 'react-router-dom';
// import React, { useContext, useState, useMemo } from 'react';
// import { ProductContext } from '../context/ProductProvider';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import PageTransition from '../components/PageTransition';

// const ProductSales = () => {
//     const { products, loading, error } = useContext(ProductContext);
//     const [sortOrder, setSortOrder] = useState('asc');
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 12;

//     const parsePrice = (priceStr) => {
//         if (!priceStr) return 0;
//         return Number(priceStr.replace(/[₫,.]/g, '').trim());
//     };

//     // Lọc các sản phẩm đang sale (trangThai === 0) và sắp xếp theo giá
//     const saleProducts = useMemo(() => {
//         const filteredProducts = products.filter(product => product.trangThai === 0);
//         return filteredProducts.sort((a, b) => {
//             const priceA = parsePrice(a.giaTien);
//             const priceB = parsePrice(b.giaTien);
//             return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
//         });
//     }, [products, sortOrder]);

//     // Tổng số trang
//     const totalPages = Math.ceil(saleProducts.length / itemsPerPage);

//     // Lấy danh sách sản phẩm cho trang hiện tại
//     const currentProducts = useMemo(() => {
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         return saleProducts.slice(startIndex, startIndex + itemsPerPage);
//     }, [saleProducts, currentPage]);

//     const handlePageChange = (page) => {
//         if (page >= 1 && page <= totalPages) {
//             setCurrentPage(page);
//         }
//     };

//     if (loading) return <div>Đang tải sản phẩm...</div>;
//     if (error) return <div>{error}</div>;

//     return (
//         <PageTransition>
//         <Navbar/>
//         <div className="container mx-auto px-4 py-6">
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold">Sản Phẩm Đang Sale</h2>
//                 <select
//                     value={sortOrder}
//                     onChange={(e) => {
//                         setSortOrder(e.target.value);
//                         setCurrentPage(1); // reset về trang đầu khi thay đổi sắp xếp
//                     }}
//                     className="border border-gray-300 rounded px-3 py-2"
//                 >
//                     <option value="asc">Giá tăng dần</option>
//                     <option value="desc">Giá giảm dần</option>
//                 </select>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {currentProducts.map((product) => (
//                     <Link
//                     to={`/product/${product.id}`}
//                     key={product.id}
//                     className="border rounded-2xl p-4 hover:shadow-lg transition relative block"
//                   >
//                     {/* Nhãn SALE */}
//                     {product.trangThai === 0 && (
//                       <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
//                         SALE
//                       </div>
//                     )}
                  
//                     <div className="flex justify-center items-center h-[180px] mb-4">
//                       <img
//                         src={product.mauSac[0]?.hinhAnh[0]?.img}
//                         alt={product.tenSanPham}
//                         className="max-h-full max-w-full object-contain"
//                       />
//                     </div>
//                     <h3
//                         className="text-lg font-semibold mb-2 overflow-hidden"
//                         style={{
//                         display: '-webkit-box',
//                         WebkitLineClamp: 3,
//                         WebkitBoxOrient: 'vertical',
//                         overflow: 'hidden',
//                         height: '4.5em', // ~ 3 dòng với line-height mặc định
//                             }}
//                             >
//                             {product.tenSanPham}
//                         </h3>
//                     {/* Giá tiền */}
//                     <div className="flex justify-center gap-3 items-center mt-2">
//                     {product.trangThai === 0 ? (
//                          <>
//                  <span className="text-red-600 font-bold">
//                     {(
//                      parsePrice(product.giaTien) * 0.9
//                      ).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
//                     </span>
//                     <span className="text-gray-500 line-through">
//                      {product.giaTien}
//                      </span>
//                          </>
//                     ) : (
//                     <span className="text-red-600 font-bold">{product.giaTien}</span>
//                         )}
//                         </div>
//                     </Link>
//                 ))}
//             </div>

//             {/* Phân trang */}
//             <div className="flex justify-center mt-8 space-x-2">
//                 <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="px-4 py-2 border rounded disabled:opacity-50"
//                 >
//                     Trước
//                 </button>
//                 {Array.from({ length: totalPages }, (_, i) => (
//                     <button
//                         key={i}
//                         onClick={() => handlePageChange(i + 1)}
//                         className={`px-4 py-2 border rounded ${currentPage === i + 1 ? 'bg-black text-white' : ''}`}
//                     >
//                         {i + 1}
//                     </button>
//                 ))}
//                 <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="px-4 py-2 border rounded disabled:opacity-50"
//                 >
//                     Tiếp
//                 </button>
//             </div>
//         </div>
//         <Footer/>
//         </PageTransition>
//     );
// };

// export default ProductSales;
// import React, { useContext, useState, useMemo } from 'react';
// import { ProductContext } from '../context/ProductProvider';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import PageTransition from '../components/PageTransition';
// import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

// const ProductSales = () => {
//     const { products, loading, error } = useContext(ProductContext);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [sortOrder, setSortOrder] = useState('asc');
//     const [selectedFilters, setSelectedFilters] = useState({
//         loai: [],
//         chatLieu: [],
//         phongCach: []
//     });
//     const [expanded, setExpanded] = useState(false);

//     const itemsPerPage = 12;

//     const filterOptions = {
//         loai: ["Túi xách tay", "Túi đeo chéo", "Túi đeo vai", "Túi mini", "Túi tote"],
//         chatLieu: ["Da tổng hợp", "Vải canvas", "Da lộn", "Nhựa trong suốt"],
//         phongCach: ["Công sở", "Dạo phố", "Dự tiệc", "Du lịch"]
//     };

//     const toggleFilter = (category, value) => {
//         setSelectedFilters(prev => {
//             const newFilters = {...prev};
//             if (newFilters[category].includes(value)) {
//                 newFilters[category] = newFilters[category].filter(item => item !== value);
//             } else {
//                 newFilters[category].push(value);
//             }
//             return newFilters;
//         });
//     };

//     const filteredProducts = useMemo(() => {
//         return products.filter(product => {
//             return Object.keys(selectedFilters).every(category => 
//                 selectedFilters[category].length === 0 || 
//                 selectedFilters[category].includes(product[category])
//             );
//         }).sort((a, b) => {
//             const priceA = parseFloat(a.giaTien.replace(/[₫,.]/g, ''));
//             const priceB = parseFloat(b.giaTien.replace(/[₫,.]/g, ''));
//             return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
//         });
//     }, [products, selectedFilters, sortOrder]);

//     return (
//         <PageTransition>
//             <Navbar/>
//             <div className="container mx-auto px-4 py-6">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-2xl font-bold">Sản Phẩm Đang Sale</h2>
//                     <div className="flex items-center space-x-4">
//                         <button onClick={() => setExpanded(!expanded)} className="px-3 py-2 border rounded flex items-center">
//                             Bộ lọc {expanded ? <ChevronUpIcon className="h-5 w-5 ml-1" /> : <ChevronDownIcon className="h-5 w-5 ml-1" />}
//                         </button>
//                         <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="px-3 py-2 border rounded">
//                             <option value="asc">Giá tăng dần</option>
//                             <option value="desc">Giá giảm dần</option>
//                         </select>
//                     </div>
//                 </div>

//                 {expanded && (
//                     <div className="bg-white p-4 shadow rounded space-y-4">
//                         <div className="flex space-x-8">
//                             {Object.keys(filterOptions).map(category => (
//                                 <div key={category} className="space-y-2">
//                                     <h3 className="font-bold">{category}</h3>
//                                     <div className="flex flex-wrap">
//                                         {filterOptions[category].map(option => (
//                                             <label key={option} className="mr-4">
//                                                 <input type="checkbox" className="mr-1" checked={selectedFilters[category].includes(option)} onChange={() => toggleFilter(category, option)} /> {option}
//                                             </label>
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="flex justify-end space-x-4">
//                             <button className="text-gray-500" onClick={() => setSelectedFilters({ loai: [], chatLieu: [], phongCach: [] })}>Hủy</button>
//                             <button className="bg-black text-white px-4 py-2" onClick={() => setExpanded(false)}>ÁP DỤNG</button>
//                         </div>
//                     </div>
//                 )}

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
//                     {filteredProducts.slice(0, itemsPerPage).map((product) => (
//                         <div key={product.id} className="border rounded-2xl p-4">
//                             <h3>{product.tenSanPham}</h3>
//                             <p>{product.giaTien}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <Footer/>
//         </PageTransition>
//     );
// };

// export default ProductSales;
import React, { useContext, useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../context/ProductProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const ProductSales = () => {
    const { products, loading, error } = useContext(ProductContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('asc');
    const [expanded, setExpanded] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        loai: [],
        chatLieu: [],
        phongCach: [],
    });
    const [selectedFiltersTemp, setSelectedFiltersTemp] = useState({ ...selectedFilters });

    const itemsPerPage = 12;

    const filterOptions = {
        loai: ["Túi xách tay", "Túi đeo chéo", "Túi đeo vai", "Túi mini", "Túi tote"],
        chatLieu: ["Da tổng hợp", "Vải canvas", "Da lộn", "Nhựa trong suốt"],
        phongCach: ["Công sở", "Dạo phố", "Dự tiệc", "Du lịch"],
    };

    const parsePrice = (priceStr) => {
        if (!priceStr) return 0;
        return Number(priceStr.replace(/[₫,.]/g, '').trim());
    };

    const toggleFilter = (category, value) => {
        setSelectedFiltersTemp((prev) => {
            const updated = { ...prev };
            updated[category] = updated[category].includes(value)
                ? updated[category].filter((item) => item !== value)
                : [...updated[category], value];
            return updated;
        });
    };

    const applyFilters = () => {
        setSelectedFilters(selectedFiltersTemp);
        setCurrentPage(1);
    };

    const saleProducts = useMemo(() => {
        const filtered = products.filter((product) => {
            if (product.trangThai !== 0) return false;

            return Object.keys(selectedFilters).every((category) => {
                return selectedFilters[category].length === 0 ||
                    selectedFilters[category].includes(product[category]);
            });
        });

        return filtered.sort((a, b) => {
            const priceA = parsePrice(a.giaTien);
            const priceB = parsePrice(b.giaTien);
            return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
        });
    }, [products, selectedFilters, sortOrder]);

    const totalPages = Math.ceil(saleProducts.length / itemsPerPage);

    const currentProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return saleProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [saleProducts, currentPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
        useEffect(() => {
            window.scrollTo(0, 0);
        }, [currentPage, selectedFilters]);

    if (loading) return <div>Đang tải sản phẩm...</div>;
    if (error) return <div>{error}</div>;

    return (
        <PageTransition>
            <Navbar />
            <div className="container mx-auto px-4 py-6">
                {/* Tiêu đề và bộ lọc + sắp xếp */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold">Sản Phẩm Đang Sale</h2>
                    <div className="flex gap-2">
                        <button onClick={() => setExpanded(!expanded)} className="px-4 py-2 border rounded flex items-center">
                            Bộ lọc {expanded ? <ChevronUpIcon className="h-5 w-5 ml-1" /> : <ChevronDownIcon className="h-5 w-5 ml-1" />}
                        </button>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-4 py-2 border rounded"
                        >
                            <option value="asc">Giá tăng dần</option>
                            <option value="desc">Giá giảm dần</option>
                        </select>
                    </div>
                </div>

{/* Bộ lọc mở rộng */}
{expanded && (
    <div className="bg-white p-4 shadow rounded mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(filterOptions).map(([category, options]) => (
                <div key={category}>
                    <h3 className="font-bold capitalize mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-3">
                        {options.map((option) => (
                            <label key={option} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedFiltersTemp[category].includes(option)}
                                    onChange={() => toggleFilter(category, option)}
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        {/* Chỉnh sửa nút Áp dụng và Hủy */}
        <div className="flex justify-end gap-4 mt-4">
            <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Áp dụng
            </button>
            <button
                onClick={() => {
                    setSelectedFiltersTemp({ ...selectedFilters });
                    setExpanded(false); // Đóng bộ lọc khi nhấn Hủy
                }}
                className="px-4 py-2 bg-gray-300 text-black rounded"
            >
                Hủy
            </button>
        </div>
    </div>
)}

                {/* Lưới sản phẩm */}

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {currentProducts.map((product) => (
        <Link
          to={`/product/${product.id}`}
          key={product.id}
          className="border rounded-xl p-4 hover:shadow-xl transition transform hover:-translate-y-2 relative block bg-white"
        >
          {/* Nhãn SALE */}
          {product.trangThai === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
              SALE
            </div>
          )}
    
          {/* Hình ảnh */}
          <div className="flex justify-center items-center h-48 mb-4 rounded-lg overflow-hidden" id='hinhanh'>
      <img
        src={product.mauSac[0]?.hinhAnh[0]?.img || '/placeholder.jpg'}
        alt={product.tenSanPham}
        className="object-contain max-h-full max-w-full transition-transform hover:scale-110 duration-300"
      />
    </div>
    
          {/* Tên sản phẩm */}
          <h3
            className="text-base font-medium text-gray-800 mb-2 line-clamp-2"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.tenSanPham}
          </h3>
    
          {/* Giá tiền */}
          <div className="flex justify-center gap-3 items-center mt-4">
            {product.trangThai === 0 ? (
              <>
                <span className="text-red-500 font-bold text-lg">
                  {(parsePrice(product.giaTien) * 0.9).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </span>
                <span className="text-gray-400 line-through text-sm">
                  {product.giaTien}
                </span>
              </>
            ) : (
              <span className="text-red-500 font-bold text-lg">{product.giaTien}</span>
            )}
          </div>
        </Link>
      ))}
    </div>

                {/* Phân trang */}
                {totalPages > 1 && (
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
                                className={`px-4 py-2 border rounded ${currentPage === i + 1 ? 'bg-black text-white' : ''}`}
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
                )}
            </div>
            <Footer />
        </PageTransition>
    );
};

export default ProductSales;


