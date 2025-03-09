import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Cart() {
  const { cart, removeFromCart, loading } = useContext(AppContext);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 animate-fade-in" aria-label="Your Cart">Your Cart</h1>
        {cart.length === 0 ? (
          <p className="text-center text-gray-600" aria-live="polite">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={`${item.productId._id}-${item.variant.color}-${item.variant.size}`} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">{item.productId.name} ({item.variant.color}, {item.variant.size})</h2>
                    <p className="text-gray-600">${item.variant.price} x {item.quantity}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId._id)}
                    disabled={loading}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Remove ${item.productId.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 text-right">
              <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
              <button
                onClick={() => navigate('/checkout')}
                className="mt-4 bg-[var(--primary)] text-white py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors"
                aria-label="Proceed to checkout"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;