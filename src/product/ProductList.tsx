import React, { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "./ProductCard";
import type { Product } from "../types/product";
import { useLocation } from "react-router-dom";
import { searchProducts } from "../api/productAPI";

const PRODUCT_UPDATED_EVENT = 'productUpdated';

const ProductList: React.FC = () => {
  const { products, refreshProducts } = useProducts();
  const [currentProducts, setCurrentProducts] = useState<Product[]>(products);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const location = useLocation();

 
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('search');
    setSearchQuery(query || "");
  }, [location.search]);


  useEffect(() => {
    setCurrentProducts(products);
  }, [products]);


  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const results = await searchProducts(searchQuery);
          setFilteredProducts(results);
        } catch (error) {
          console.error('Search error:', error);
          setFilteredProducts([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setFilteredProducts(currentProducts);
      }
    };

    performSearch();
  }, [searchQuery, currentProducts]);

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


  const displayProducts = searchQuery ? filteredProducts : currentProducts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50/70 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 mt-12 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80"></div>
          
         
          {searchQuery ? (
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Search Results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">"{searchQuery}"</span>
            </h2>
          ) : (
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">Products</span>
            </h2>
          )}
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {searchQuery 
              ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} matching your search`
              : "Discover our amazing collection of products with great discounts and fast shipping."
            }
          </p>
          
          <div className="mt-4 flex justify-center">
            <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
          </div>
        </div>

     
        {isSearching && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            <p className="mt-2 text-gray-600">Searching products...</p>
          </div>
        )}

     
        {!isSearching && searchQuery && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">We couldn't find any products matching "{searchQuery}"</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-amber-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
            >
              View All Products
            </button>
          </div>
        )}
     
      
        {!isSearching && displayProducts.length > 0 && (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 md:gap-10">
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={handleView}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;