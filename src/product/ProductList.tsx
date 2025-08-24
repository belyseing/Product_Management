import React, { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "./ProductCard";
import type { Product } from "../types/product";

const PRODUCT_UPDATED_EVENT = 'productUpdated';

const ProductList: React.FC = () => {
  const { products, refreshProducts } = useProducts();
  const [currentProducts, setCurrentProducts] = useState<Product[]>(products);

  useEffect(() => {
    setCurrentProducts(products);
  }, [products]);

  useEffect(() => {
    const handleProductUpdated = (event: CustomEvent) => {
      const { productId, updatedProduct } = event.detail;
      

      setCurrentProducts(prevProducts => 
        prevProducts.map(product => 
          product.id.toString() === productId ? { ...product, ...updatedProduct } : product
        )
      );
 
      refreshProducts();
    };

 
    window.addEventListener(PRODUCT_UPDATED_EVENT as any, handleProductUpdated as EventListener);


    return () => {
      window.removeEventListener(PRODUCT_UPDATED_EVENT as any, handleProductUpdated as EventListener);
    };
  }, [refreshProducts]);

  const handleView = (product: Product) => {
    console.log("View product:", product);
  };

  const handleAddToCart = (product: Product) => {
    console.log("Add to cart:", product);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50/70 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 mt-12 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80"></div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">Products</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our amazing collection of products with great discounts and fast shipping.
          </p>
          <div className="mt-4 flex justify-center">
            <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
          </div>
        </div>
     
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 md:gap-10">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={handleView}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;