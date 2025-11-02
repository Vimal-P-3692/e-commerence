import { useState } from 'react';
import { useCart } from '../context/CartContext';

function OrderModal({ isOpen, onClose }) {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');

  const ADMIN_PHONE = '918778879866'; // WhatsApp format: country code + number

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      setError('Please fill in all fields');
      return;
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    // Prepare order details message
    let message = `*New Order from E-Shop*\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${formData.name}\n`;
    message += `Phone: ${formData.phone}\n`;
    message += `Address: ${formData.address}\n\n`;
    message += `*Order Details:*\n`;
    
    cartItems.forEach((item, index) => {
      message += `\n${index + 1}. ${item.name}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ₹${item.price.toLocaleString('en-IN')} × ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString('en-IN')}\n`;
    });
    
    message += `\n*Total Amount: ₹${getTotalPrice().toLocaleString('en-IN', { maximumFractionDigits: 0 })}*`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with pre-filled message
    const whatsappURL = `https://wa.me/${ADMIN_PHONE}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');

    // Clear cart and close modal
    setTimeout(() => {
      clearCart();
      handleClose();
      alert('Your order has been sent to the admin via WhatsApp!');
    }, 1000);
  };

  const handleClose = () => {
    setFormData({ name: '', phone: '', address: '' });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full my-8 animate-slideUp">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Complete Your Order</h2>
          <p className="text-gray-600 text-sm mt-1">Please provide your delivery details</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-200"
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Delivery Address *</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-200"
                placeholder="Enter your complete delivery address"
                rows="3"
                required
              />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({cartItems.length})</span>
                  <span className="font-medium">₹{getTotalPrice().toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between">
                  <span className="font-bold text-gray-800">Total Amount</span>
                  <span className="font-bold text-purple-600">₹{getTotalPrice().toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm animate-shake">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 active:scale-95 transition-all duration-200 font-medium"
              >
                Send Order via WhatsApp
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 active:scale-95 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;
