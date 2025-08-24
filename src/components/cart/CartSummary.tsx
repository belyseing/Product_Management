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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FaShoppingCart className="mr-2 text-amber-600" />
        Order Summary
      </h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Items ({totalItems})</span>
          <span className="font-semibold">${totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">$0.00</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-semibold">${(totalPrice * 0.1).toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-amber-600">
              ${(totalPrice * 1.1).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={totalItems === 0 || isLoading}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? 'Processing...' : 'Proceed to Checkout'}
      </button>

      {totalItems === 0 && (
        <p className="text-center text-gray-500 mt-4 text-sm">
          Your cart is empty
        </p>
      )}
    </div>
  );
};

export default CartSummary;