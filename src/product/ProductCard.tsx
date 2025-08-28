import React, { useState } from "react";
import { FaShoppingCart, FaEye, FaStar, FaHeart } from "react-icons/fa";
import type { Product } from "../types/product";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  const productInCart = isInCart(product.id);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(product);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg flex flex-col h-full border border-white/50 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/30 via-amber-50/20 to-indigo-50/30 opacity-0 group-hover:opacity-100"></div>
      <div className="absolute w-20 h-20 bg-gradient-to-bl from-amber-100/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-indigo-100/50 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100"></div>

      <div className="relative overflow-hidden h-64 w-full flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/70 rounded-2xl shadow-inner">
        <div className="absolute top-4 left-6 w-16 h-16 bg-gradient-to-br from-red-200/40 to-rose-200/40 rounded-full blur-3xl opacity-50 animate-blob"></div>

        <img 
          src={product.thumbnail} 
          alt={product.title} 
          className="w-full h-full object-contain bg-white rounded-xl shadow-lg transition-transform duration-500 hover:scale-105"
        />
        
        {product.discountPercentage && (
          <div className="absolute top-5 left-5 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl">
            {product.discountPercentage}% OFF
          </div>
        )}

        <div className="absolute top-5 right-5 flex items-center bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-amber-600 shadow-xl border border-amber-200/50">
          <FaStar className="mr-2 text-amber-500 drop-shadow-sm" />
          <span>{product.rating?.toFixed(1) || '4.5'}</span>
        </div>

        <button 
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`absolute top-18 right-5 flex items-center justify-center w-8 h-8 rounded-full z-10 ${
            isWishlisted 
              ? "bg-gradient-to-r from-amber-500 to-amber-500 text-white shadow-xl scale-110 animate-pulse" 
              : "bg-white/95 backdrop-blur-md text-gray-500 hover:text-amber-600 shadow-lg hover:shadow-xl hover:scale-110"
          }`}
        >
          <FaHeart size={16} />
        </button>

        <div className="absolute bottom-5 left-0 right-0 flex justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleAddToCart}
            disabled={productInCart || isAddingToCart}
            className={`mx-2 px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold flex items-center shadow-xl ${
              productInCart || isAddingToCart
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 via-orange-500 to-orange-500 text-white hover:from-amber-600 hover:via-amber-600 hover:to-amber-600 hover:scale-105 animate-pulse hover:animate-none"
            }`}
          >
            <FaShoppingCart className="mr-1 md:mr-2 transition-transform hover:scale-110" />
            <span className="text-xs md:text-sm font-medium">
              {isAddingToCart ? "Adding..." : productInCart ? "Added" : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>

      <div className="relative p-7 flex flex-col flex-grow z-10">
        <div className="mb-6 flex-grow">
          <span className="inline-block px-4 py-2 text-xs font-bold rounded-full bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 text-indigo-700 mb-5 border-2 border-white shadow-md">
            {product.category}
          </span>
          
          <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight">
            {product.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-1">
            {product.description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-auto pt-6 border-t border-gray-200">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-900">
              ${product.price.toLocaleString()}
            </span>
            {product.discountPercentage && (
              <span className="text-sm text-red-500 line-through">
                ${(product.price * (1 + product.discountPercentage / 100)).toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 text-indigo-700 px-4 py-2 md:px-6 md:py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 md:gap-3 border-2 border-white shadow-lg hover:scale-105"
          >
            <FaEye className="text-current transition-transform hover:scale-125" />
            <span className="text-xs md:text-sm font-bold">View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;