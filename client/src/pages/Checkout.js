import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const stripePromise = loadStripe('your_stripe_publishable_key');

function CheckoutForm() {
  const { cart, user } = useContext(AppContext);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/payment/create-payment-intent', {
        amount: Math.round(total * 100),
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const { error: stripeError } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      });

      if (stripeError) throw new Error(stripeError.message);

      await axios.post('http://localhost:5000/api/orders', {
        products: cart.map(item => ({ productId: item.productId._id, quantity: item.quantity, variant: item.variant })),
        total,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success('Order placed successfully');
      navigate('/');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
      <p className="mb-4">Total: ${total.toFixed(2)}</p>
      <CardElement className="border p-3 rounded-lg mb-4" aria-label="Enter card details" />
      {error && <p className="text-red-500 mb-4" aria-live="polite">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-[var(--primary)] text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-400"
        aria-label="Pay now"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

function Checkout() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 animate-fade-in" aria-label="Checkout">Checkout</h1>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}

export default Checkout;