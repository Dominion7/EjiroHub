import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      toast.success('Registered successfully');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6" aria-label="Register">Register</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name" className="block mb-2">Name:</label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            aria-label="Enter your name"
          />
          <label htmlFor="email" className="block mb-2">Email:</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            aria-label="Enter your email"
          />
          <label htmlFor="password" className="block mb-2">Password:</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            aria-label="Enter your password"
          />
          {error && <p className="text-red-500 mb-4" aria-live="polite">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--primary)] text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-400"
            aria-label="Register"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;