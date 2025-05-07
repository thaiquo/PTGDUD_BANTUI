import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Tạo Context cho sản phẩm
export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [banner, setBanner] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiURL = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000/api/db.json' 
        : 'https://ptgud-tv-store-react.onrender.com/api/db.json';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(apiURL);

                // // Log toàn bộ phản hồi từ API để kiểm tra cấu trúc dữ liệu
                // console.log('Response:', response.data);

                // Kiểm tra dữ liệu trả về là một mảng
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const data = response.data[0]; // Lấy đối tượng đầu tiên từ mảng

                    // Lấy danh sách sản phẩm
                    setProducts(data.sanpham || []);

                    // Lấy danh sách banner
                    setBanner(data.banner || []);

                    setError(null);
                } else {
                    setError('Dữ liệu không hợp lệ hoặc không có sản phẩm');
                }
            } catch (err) {
                setError(`❌ Không thể lấy dữ liệu sản phẩm: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
    
        fetchProducts();
    }, [apiURL]);

    return (
        <ProductContext.Provider value={{ products, banner, loading, error }}>
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;
