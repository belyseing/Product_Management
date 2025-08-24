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
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md mb-3">
      <div className="flex items-center space-x-4 flex-1">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-16 h-16 object-cover rounded-md"
        />
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{product.title}</h3>
          <p className="text-gray-600 text-sm">{product.category}</p>
          <p className="text-lg font-bold text-amber-600">${product.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <FaMinus size={12} />
          </button>
          
          <span className="w-8 text-center font-semibold">{quantity}</span>
          
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <FaPlus size={12} />
          </button>
        </div>

        <div className="w-20 text-right">
          <p className="font-bold text-gray-800">${totalPrice.toFixed(2)}</p>
        </div>

        <button
          onClick={() => onRemove(product.id)}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;