import React, { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "./ProductCard";
import type { Product } from "../types/product";
import { useLocation } from "react-router-dom";
import { searchProducts,getProductById} from "../api/productAPI";

const PRODUCT_UPDATED_EVENT = 'productUpdated';
const PRODUCT_ADDED_EVENT = 'productAdded';

const ProductList: React.FC = () => {
  const { products, refreshProducts } = useProducts();
  const [currentProducts, setCurrentProducts] = useState<Product[]>(products);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const location = useLocation();

  // Get search query and category from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('search');
    const category = searchParams.get('category');
    
    setSearchQuery(query || "");
    setSelectedCategory(category || "");
  }, [location.search]);

  // Update current products when products change
  useEffect(() => {
    setCurrentProducts(products);
  }, [products]);

  // Handle search and category functionality
  useEffect(() => {
    const performFilter = async () => {
      if (searchQuery.trim() || selectedCategory) {
        setIsSearching(true);
        try {
          let results;
          
          if (searchQuery.trim()) {
            // Search by query
            results = await searchProducts(searchQuery);
          } else {
            // Use current products instead of fetching again to include newly added products
            results = currentProducts;
          }
          
          // Filter by category if selected
          if (selectedCategory && selectedCategory !== "all") {
            results = results.filter(product => {
              const productCategory = product.category.toLowerCase();
              const selectedCat = selectedCategory.toLowerCase();
              
              // Try both direct match and slug match
              return productCategory === selectedCat || 
                     productCategory === selectedCat.replace(/-/g, ' ') ||
                     productCategory.replace(/\s+/g, '-') === selectedCat;
            });
          }
          
          setFilteredProducts(results);
        } catch (error) {
          console.error('Filter error:', error);
          setFilteredProducts([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setFilteredProducts(currentProducts);
      }
    };

    performFilter();
  }, [searchQuery, selectedCategory, currentProducts]);

  // Listen for product updates
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

  // Listen for new product additions
  useEffect(() => {
    const handleProductAdded = (event: CustomEvent) => {
      const { product } = event.detail;
      
      // Add the new product to the beginning of the list
      setCurrentProducts(prevProducts => [product, ...prevProducts]);
      
      // Also refresh the products from the hook to keep everything in sync
      refreshProducts();
    };

    window.addEventListener(PRODUCT_ADDED_EVENT as any, handleProductAdded as EventListener);

    return () => {
      window.removeEventListener(PRODUCT_ADDED_EVENT as any, handleProductAdded as EventListener);
    };
  }, [refreshProducts]);

  const handleView = (product: Product) => {
    console.log("View product:", product);
  };

  const handleAddToCart = (product: Product) => {
    console.log("Add to cart:", product);
  };

  // Determine which products to display
  const displayProducts = (searchQuery || selectedCategory) ? filteredProducts : currentProducts;

  // Generate page title based on filters
  const getPageTitle = () => {
    if (searchQuery && selectedCategory && selectedCategory !== "all") {
      return `Search Results for "${searchQuery}" in ${getCategoryDisplayName()}`;
    } else if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    } else if (selectedCategory && selectedCategory !== "all") {
      return `${getCategoryDisplayName()} Products`;
    } else {
      return "Our Products";
    }
  };

  // Generate description based on filters
  const getPageDescription = () => {
    const productCount = displayProducts.length;
    
    if (searchQuery && selectedCategory && selectedCategory !== "all") {
      return `Found ${productCount} product${productCount !== 1 ? 's' : ''} matching "${searchQuery}" in ${getCategoryDisplayName()}`;
    } else if (searchQuery) {
      return `Found ${productCount} product${productCount !== 1 ? 's' : ''} matching your search`;
    } else if (selectedCategory && selectedCategory !== "all") {
      return `Found ${productCount} product${productCount !== 1 ? 's' : ''} in ${getCategoryDisplayName()}`;
    } else {
      return "Discover our amazing collection of products with great discounts and fast shipping.";
    }
  };

  // Helper function to get category display name
  const getCategoryDisplayName = () => {
    if (!selectedCategory || selectedCategory === "all") return "";
    
    // Convert slug back to readable name
    return selectedCategory
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50/70 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 mt-12 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80"></div>
          
          {/* Dynamic title */}
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            {getPageTitle().split(' ').map((word, index, array) => {
              if (word.includes('"') || (selectedCategory && selectedCategory !== "all" && index === 0)) {
                return (
                  <span key={index} className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">
                    {word}{' '}
                  </span>
                );
              }
              return word + ' ';
            })}
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {getPageDescription()}
          </p>
          
          <div className="mt-4 flex justify-center">
            <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
          </div>
        </div>

        {/* Loading state */}
        {isSearching && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        )}

        {/* No results state */}
        {!isSearching && (searchQuery || (selectedCategory && selectedCategory !== "all")) && displayProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery && selectedCategory && selectedCategory !== "all"
                ? `We couldn't find any products matching "${searchQuery}" in ${getCategoryDisplayName()}`
                : searchQuery
                ? `We couldn't find any products matching "${searchQuery}"`
                : `We couldn't find any products in ${getCategoryDisplayName()}`
              }
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-amber-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
            >
              View All Products
            </button>
          </div>
        )}
     
        {/* Products grid */}
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