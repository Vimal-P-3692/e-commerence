import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Header() {
  const { cartItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <>
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <nav className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl sm:text-2xl font-bold hover:text-purple-200 transition">
              🛍️ Selvam
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              <ul className="flex items-center space-x-8">
                <li>
                  <Link 
                    to="/" 
                    className="hover:text-purple-200 transition font-medium text-lg"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/cart" 
                    className="hover:text-purple-200 transition font-medium text-lg relative"
                  >
                    Cart
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="hover:text-purple-200 transition font-medium text-lg"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-4 animate-slideDown">
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block hover:text-purple-200 transition-colors duration-200 font-medium text-lg"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/cart" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block hover:text-purple-200 transition-colors duration-200 font-medium text-lg"
                  >
                    Cart {cartItems.length > 0 && `(${cartItems.length})`}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block hover:text-purple-200 transition-colors duration-200 font-medium text-lg"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
              
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span className="text-xl">+</span>
                Add Product
              </button>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}

export default Header;
