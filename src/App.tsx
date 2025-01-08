import React, { useState } from 'react';
import ProductDisplay from './components/ProductDisplay';
import OrderForm from './components/OrderForm';
import CustomerSupport from './components/CustomerSupport';
import AdminDashboard from './components/AdminDashboard';
import { ShoppingCart, X } from 'lucide-react';

export default function App() {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const addToCart = (product: any) => {
    setCartItems([...cartItems, product]);
    setShowCart(true);
  };

  // Toggle between admin and customer view (you should implement proper auth)
  const toggleView = () => {
    setIsAdmin(!isAdmin);
  };

  if (isAdmin) {
    return (
      <>
        <button
          onClick={toggleView}
          className="fixed top-4 right-4 px-4 py-2 bg-purple-600 text-white rounded-lg z-50"
        >
          Switch to Store
        </button>
        <AdminDashboard />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">SmartWatch Pro Max</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleView}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Admin
            </button>
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <ProductDisplay onAddToCart={addToCart} />
      </main>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <>
                  {cartItems.map((item, index) => (
                    <div key={index} className="mb-4 p-4 border rounded-lg">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">${item.price}</p>
                      <p className="text-sm text-gray-500">
                        {item.color} • {item.size}
                      </p>
                    </div>
                  ))}
                  <OrderForm items={cartItems} onComplete={() => setShowCart(false)} />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Customer Support */}
      <CustomerSupport />
    </div>
  );
}