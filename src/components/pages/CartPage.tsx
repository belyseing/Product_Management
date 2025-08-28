import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CartItem from '../cart/CartItem';
import CartSummary from '../cart/CartSummary';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here!');
    clearCart();
  };

  const handleGoBack = () => {
    navigate('/ProductList');
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <FaShoppingCart className="mx-auto text-amber-400 text-6xl mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart!</p>
            <button
              onClick={handleGoBack} 
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center mx-auto"
            >
              <FaArrowLeft className="mr-2" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Products
        </button>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaShoppingCart className="mr-3 text-amber-600" />
            Shopping Cart ({cart.totalItems} items)
          </h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 font-semibold"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {cart.items.map((item) => (
                <CartItem
                  key={item.product.id}
                  product={item.product}
                  quantity={item.quantity}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <CartSummary
              totalItems={cart.totalItems}
              totalPrice={cart.totalPrice}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;