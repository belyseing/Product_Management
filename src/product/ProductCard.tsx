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
    <div className="group relative bg-slate-50 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col h-full transition-transform transform hover:-translate-y-2 hover:shadow-3xl">
      
    
      <div className="relative h-64 w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-5 rounded-2xl">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-contain rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-105"
        />

        
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform ${
            isWishlisted
              ? "bg-amber-500 text-white scale-110 animate-pulse"
              : "bg-white text-amber-500 hover:bg-amber-100 hover:text-amber-600"
          }`}
        >
          <FaHeart />
        </button>

       
        <div className="absolute top-4 left-4 bg-amber-50 text-amber-600 px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold shadow">
          <FaStar /> {product.rating?.toFixed(1) || "4.5"}
        </div>

       
        {product.discountPercentage && (
          <div className="absolute top-16 left-4 bg-amber-200 text-amber-900 px-3 py-1 rounded-full text-xs font-bold shadow">
            {product.discountPercentage}% OFF
          </div>
        )}
      </div>

 
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-amber-700 mb-2 uppercase">
          {product.category}
        </span>
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">{product.description}</p>

       
        <div className="mt-auto flex items-center justify-between">
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

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-slate-100 text-slate-900 px-4 py-2 rounded-xl font-semibold shadow hover:bg-slate-200 transition"
            >
              <FaEye className="inline mr-1" /> View
            </button>

            <button
              onClick={handleAddToCart}
              disabled={productInCart || isAddingToCart}
              className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-1 shadow transition ${
                productInCart || isAddingToCart
                  ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                  : "bg-amber-500 text-white hover:bg-amber-600"
              }`}
            >
              <FaShoppingCart /> {productInCart ? "Added" : isAddingToCart ? "Adding..." : "Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
