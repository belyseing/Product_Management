import React from 'react';
import { Product } from '../../types/product';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

interface CartItemProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  product,
  quantity,
  onUpdateQuantity,
  onRemove
}) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      onUpdateQuantity(product.id, newQuantity);
    }
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="relative flex flex-col md:flex-row items-center p-6 bg-slate-50 rounded-2xl shadow-md border border-slate-200 overflow-hidden mb-4">
      {/* Product Thumbnail */}
      <div className="flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-inner">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between ml-5 mt-4 md:mt-0">
        <div>
          <h3 className="text-slate-900 font-bold text-lg line-clamp-2">{product.title}</h3>
          <p className="text-slate-500 text-sm mt-1">{product.category}</p>
        </div>
        <p className="text-amber-600 font-extrabold text-xl mt-2">${product.price.toFixed(2)}</p>
      </div>

      {/* Quantity Controls & Total */}
      <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
        <div className="flex items-center space-x-2 bg-slate-100 rounded-full px-3 py-1 border border-slate-200">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors"
          >
            <FaMinus size={14} />
          </button>
          <span className="w-8 text-center font-semibold text-slate-900">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors"
          >
            <FaPlus size={14} />
          </button>
        </div>

        <p className="text-amber-600 font-extrabold text-xl">${totalPrice.toFixed(2)}</p>

        <button
          onClick={() => onRemove(product.id)}
          className="p-3 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-600 transition-colors shadow"
        >
          <FaTrash size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
