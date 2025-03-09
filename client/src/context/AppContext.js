import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiUrl = 'http://localhost:5000/api'; // Update for production

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
      fetchWishlist();
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setUser({ email });
      await Promise.all([fetchCart(), fetchWishlist()]);
      toast.success('Logged in successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCart([]);
    setWishlist([]);
    toast.info('Logged out');
  };

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${apiUrl}/cart`, { headers: { Authorization: `Bearer ${token}` } });
    setCart(res.data);
    return res.data;
  };

  const fetchWishlist = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${apiUrl}/wishlist`, { headers: { Authorization: `Bearer ${token}` } });
    setWishlist(res.data);
    return res.data;
  };

  const addToCart = async (productId, quantity, variant) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      throw new Error('Please login first');
    }
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/cart/add`, { productId, quantity, variant }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
      toast.success('Added to cart');
    } catch (err) {
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${apiUrl}/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
      toast.success('Removed from cart');
    } catch (err) {
      toast.error('Failed to remove from cart');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId, variant) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      throw new Error('Please login first');
    }
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/wishlist/add`, { productId, variant }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(res.data);
      toast.success('Added to wishlist');
    } catch (err) {
      toast.error('Failed to add to wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${apiUrl}/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(res.data);
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove from wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{ user, cart, wishlist, loading, login, logout, addToCart, removeFromCart, addToWishlist, removeFromWishlist }}>
      {children}
    </AppContext.Provider>
  );
};