import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

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
    const fetchData = async () => {
      try {
        const res = await axios.get(apiURL);
        const data = res.data?.[0] || {};

        setProducts(data.sanpham || []);
        setBanner(data.banner || []);
      } catch (err) {
        setError(`❌ Không thể lấy dữ liệu: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiURL]);

  return (
    <ProductContext.Provider value={{ products, banner, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
