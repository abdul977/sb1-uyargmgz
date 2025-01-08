import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase, signInUser } from '../lib/supabase';

interface OrderFormProps {
  items: any[];
  onComplete: () => void;
}

export default function OrderForm({ items, onComplete }: OrderFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    shippingAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authStep, setAuthStep] = useState<'form' | 'verify'>('form');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First, sign in the user with their email
      const { error: authError } = await signInUser(formData.email);
      if (authError) throw authError;

      // Set auth step to verify
      setAuthStep('verify');
      
      // Create the order
      const orderNumber = `ORD-${uuidv4().slice(0, 8)}`;
      const { error: dbError } = await supabase.from('orders').insert({
        order_number: orderNumber,
        customer_name: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        shipping_address: formData.shippingAddress,
        product_details: items,
      });

      if (dbError) throw dbError;

      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authStep === 'verify') {
    return (
      <div className="text-center p-6">
        <h3 className="text-lg font-semibold mb-2">Check Your Email</h3>
        <p className="text-gray-600">
          We've sent a verification link to {formData.email}. Please check your email to complete your order.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.customerName}
          onChange={(e) =>
            setFormData({ ...formData, customerName: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Shipping Address
        </label>
        <textarea
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          value={formData.shippingAddress}
          onChange={(e) =>
            setFormData({ ...formData, shippingAddress: e.target.value })
          }
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}