import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { addToCart, addToWishlist, loading, user } = useContext(AppContext);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      const data = res.data;
      setProduct(data);
      if (data.variants.length > 0) {
        setSelectedColor(data.variants[0].color);
        setAvailableSizes(data.variants.filter(v => v.color === data.variants[0].color).map(v => v.size));
        setSelectedSize(data.variants[0].size);
      }
    } catch (err) {
      toast.error('Failed to load product');
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}/reviews`);
      setReviews(res.data);
    } catch (err) {
      toast.error('Failed to load reviews');
    }
  };

  useEffect(() => {
    if (selectedColor && product) {
      const sizes = product.variants.filter(v => v.color === selectedColor).map(v => v.size);
      setAvailableSizes(sizes);
      if (!sizes.includes(selectedSize)) setSelectedSize(sizes[0]);
    }
  }, [selectedColor, product]);

  const handleAddToCart = () => {
    const variant = product.variants.find(v => v.color === selectedColor && v.size === selectedSize);
    if (variant && variant.stock > 0) {
      addToCart(product._id, 1, { color: selectedColor, size: selectedSize, price: variant.price });
    } else {
      toast.error('Variant out of stock');
    }
  };

  const handleAddToWishlist = () => {
    const variant = product.variants.find(v => v.color === selectedColor && v.size === selectedSize);
    if (variant) {
      addToWishlist(product._id, { color: selectedColor, size: selectedSize });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to leave a review');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/products/${id}/reviews`, { rating, comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRating(0);
      setComment('');
      fetchReviews();
      toast.success('Review submitted');
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  if (!product) return <div className="text-center py-8" aria-live="polite">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6">
          <img
            src={product.variants.find(v => v.color === selectedColor && v.size === selectedSize)?.images[0] || product.images[0]}
            alt={product.name}
            className="w-full md:w-1/2 h-96 object-cover rounded"
            aria-label={`Image of ${product.name}`}
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">
              ${product.variants.find(v => v.color === selectedColor && v.size === selectedSize)?.price || 'Select variant'}
            </p>
            <p className="text-gray-700 mb-6">{product.description}</p>
            {product.variants.length > 1 && (
              <div className="mb-4">
                <label className="block mb-2" htmlFor="color-select">Color:</label>
                <select
                  id="color-select"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  aria-label="Select color"
                >
                  {Array.from(new Set(product.variants.map(v => v.color))).map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
                <label className="block mt-4 mb-2" htmlFor="size-select">Size:</label>
                <select
                  id="size-select"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  disabled={!selectedColor}
                  aria-label="Select size"
                >
                  {availableSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={loading || !selectedColor || !selectedSize || product.variants.find(v => v.color === selectedColor && v.size === selectedSize)?.stock === 0}
                className="flex-1 bg-[var(--primary)] text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-400"
                aria-label={`Add ${product.name} to cart`}
              >
                {loading ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={handleAddToWishlist}
                disabled={loading}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400"
                aria-label={`Add ${product.name} to wishlist`}
              >
                {loading ? 'Adding...' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            reviews.map(review => (
              <div key={review._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                <p className="text-gray-800 font-semibold">{review.userId.name} - {review.rating}/5</p>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-gray-500 text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
          <form onSubmit={handleReviewSubmit} className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <label htmlFor="rating" className="block mb-2">Rating (1-5):</label>
            <input
              id="rating"
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              aria-label="Rate this product"
            />
            <label htmlFor="comment" className="block mb-2">Comment:</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              aria-label="Write a review"
            />
            <button
              type="submit"
              disabled={loading || !rating || !comment}
              className="w-full bg-[var(--primary)] text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-400"
              aria-label="Submit review"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Product;