import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProductContext = createContext();

// Google Sheets Configuration
const SHEET_ID = '1WT2t2Gcplr3vbSam8lEnxcwBGl_fnYUwDUBlEE0X3fs';
const SHEET_NAME = 'Selvam Departments';
const GOOGLE_SHEETS_API_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from Google Sheets
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(GOOGLE_SHEETS_API_URL);
        
        // Parse the response (Google Sheets returns JSONP, need to extract JSON)
        const jsonString = response.data.substring(47).slice(0, -2);
        const data = JSON.parse(jsonString);
        
        // Extract rows and convert to product objects
        const rows = data.table.rows;
        const productsData = rows.map((row) => {
          const cells = row.c;
          return {
            id: cells[0]?.v || 0, // Column A: id
            name: cells[1]?.v || '', // Column B: name
            description: cells[2]?.v || '', // Column C: description
            price: cells[3]?.v || 0, // Column D: price
            image: cells[4]?.v || '', // Column E: image
          };
        }).filter(product => product.id && product.name); // Filter out empty rows
        
        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching products from Google Sheets:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    
    // Optionally, refresh products every 5 minutes
    const interval = setInterval(fetchProducts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    products,
    loading,
    error,
    // Note: addProduct, deleteProduct, updateProduct removed
    // Products are now managed in Google Sheets
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
