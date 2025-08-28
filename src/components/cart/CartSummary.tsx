import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
  onCheckout?: () => void;
  isLoading?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  totalItems,
  totalPrice,
  onCheckout,
  isLoading = false
}) => {
  return (
    <div className="bg-slate-50 rounded-3xl shadow-xl p-6 border border-slate-200">
      
   
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
        <FaShoppingCart className="mr-2 text-amber-500" />
        Order Summary
      </h2>

     
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-slate-600 font-medium">Items ({totalItems})</span>
          <span className="text-slate-900 font-semibold">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600 font-medium">Shipping</span>
          <span className="text-slate-900 font-semibold">$0.00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600 font-medium">Tax</span>
          <span className="text-slate-900 font-semibold">${(totalPrice * 0.1).toFixed(2)}</span>
        </div>
        <div className="border-t border-slate-200 pt-4">
          <div className="flex justify-between text-lg font-bold text-slate-900">
            <span>Total</span>
            <span className="text-amber-600">${(totalPrice * 1.1).toFixed(2)}</span>
          </div>
        </div>
      </div>

    
      <button
        onClick={onCheckout}
        disabled={totalItems === 0 || isLoading}
        className="w-full bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Processing...' : 'Order Now'}
      </button>

      {totalItems === 0 && (
        <p className="text-center text-slate-500 mt-4 text-sm">
          Your cart is empty
        </p>
      )}
    </div>
  );
};

export default CartSummary;
