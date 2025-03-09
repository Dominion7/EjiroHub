import React from 'react';

function Footer() {
  return (
    <footer className="bg-[var(--secondary)] text-white py-6 mt-8">
      <div className="container mx-auto px-4 text-center">
        <p>© 2025 EjiroHub. All rights reserved.</p>
        <div className="mt-2">
          <a href="#" className="mx-2 hover:text-[var(--primary)]" aria-label="Terms of Service">Terms</a>
          <a href="#" className="mx-2 hover:text-[var(--primary)]" aria-label="Privacy Policy">Privacy</a>
          <a href="#" className="mx-2 hover:text-[var(--primary)]" aria-label="Contact Us">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;