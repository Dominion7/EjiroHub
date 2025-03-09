import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Header() {
  const { user, logout, cart, wishlist } = useContext(AppContext);

  return (
    <header className="bg-[var(--secondary)] text-white py-4 sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold" aria-label="EjiroHub Home">EjiroHub</Link>
        <nav className="flex gap-6">
          <Link to="/shop" aria-label="Shop">Shop</Link>
          <Link to="/cart" aria-label={`Cart with ${cart.length} items`}>Cart ({cart.length})</Link>
          <Link to="/wishlist" aria-label={`Wishlist with ${wishlist.length} items`}>Wishlist ({wishlist.length})</Link>
          {user ? (
            <button onClick={logout} className="hover:text-[var(--primary)]" aria-label="Logout">Logout</button>
          ) : (
            <>
              <Link to="/login" aria-label="Login">Login</Link>
              <Link to="/register" aria-label="Register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;