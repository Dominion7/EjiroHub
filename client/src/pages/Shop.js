import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const { addToCart, loading } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [search, category, minPrice, maxPrice]);

  const fetchCategories = async () => {
    const res = await axios.get('http://localhost:5000/api/products/categories');
    setCategories(res.data);
  };

  const fetchProducts = async () => {
    const params = { search, category, minPrice, maxPrice };
    const res = await axios.get('http://localhost:5000/api/products', { params });
    setProducts(res.data);
  };

  const handleAddToCart = (productId, variant) => {
    addToCart(productId, 1, variant).catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 animate-fade-in" aria-label="Shop EjiroHub">
          Shop EjiroHub
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-full"
              aria-label="Search products"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-full"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-full"
              aria-label="Minimum price filter"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-full"
              aria-label="Maximum price filter"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-56 object-cover cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                <p className="text-gray-600">${product.variants[0].price}</p>
                <button
                  onClick={() => handleAddToCart(product._id, product.variants[0])}
                  disabled={loading}
                  className="mt-4 w-full bg-[var(--primary)] text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-400"
                  aria-label={`Add ${product.name} to cart`}
                >
                  {loading ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;