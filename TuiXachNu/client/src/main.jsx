import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ProductProvider from '../src/context/ProductProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ProductProvider>
    <App />
  </ProductProvider>
);
