import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, loading } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6" aria-label="Login">Login</h1>
        <form onSubmit={handleSubmit}>
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
            aria-label="Login"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;