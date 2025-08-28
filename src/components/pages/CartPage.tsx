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
    navigate('/'); 
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <FaShoppingCart className="mx-auto text-amber-400 text-6xl mb-6" />
            <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Your Cart is Empty</h1>
            <p className="text-slate-600 mb-8">Start shopping to add items to your cart!</p>
            <button
              onClick={handleGoBack} 
              className="bg-amber-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center mx-auto"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-4">

        
        <button
          onClick={handleGoBack}
          className="flex items-center bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-xl font-semibold  transition-colors mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Products
        </button>

       
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center">
            <FaShoppingCart className="mr-3 text-amber-500" />
            Shopping Cart ({cart.totalItems})
          </h1>
          <button
            onClick={clearCart}
            className="bg-slate-200 text-slate-800 px-4 py-2 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
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
