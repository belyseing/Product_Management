import React, { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "./ProductCard";
import type { Product } from "../types/product";
import { useLocation } from "react-router-dom";
import { searchProducts, getCategories, getProductsByCategory } from "../api/productAPI";

const PRODUCT_UPDATED_EVENT = 'productUpdated';

interface Category {
  id: number;
  name: string;
  slug: string;
}

const ProductList: React.FC = () => {
  const { products, refreshProducts } = useProducts();
  const [currentProducts, setCurrentProducts] = useState<Product[]>(products);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const location = useLocation();

 
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('search');
    const category = searchParams.get('category');
    
    setSearchQuery(query || "");
    setSelectedCategory(category || "all");
  }, [location.search]);



useEffect(() => {
  const filterProducts = async () => {
    if (selectedCategory !== "all") {
      setIsSearching(true);
      try {
       
        const categoryProducts = await getProductsByCategory(selectedCategory);
        setFilteredProducts(categoryProducts);
      } catch (error) {
        console.error('Error fetching category products:', error);
        setFilteredProducts([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      
      setFilteredProducts(currentProducts);
    }
  };

  if (selectedCategory !== "all") {
    filterProducts();
  } else {
    setFilteredProducts(currentProducts);
  }
}, [selectedCategory, currentProducts]);




  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
       
        if (cats.length > 0 && typeof cats[0] === 'object') {
          setCategories(cats as Category[]);
        } else {
          setCategories((cats as string[]).map((cat, index) => ({
            id: index,
            name: cat,
            slug: cat.toLowerCase().replace(/\s+/g, '-')
          })));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([
          { id: 1, name: "Smartphones", slug: "smartphones" },
          { id: 2, name: "Laptops", slug: "laptops" },
          { id: 3, name: "Fragrances", slug: "fragrances" },
          { id: 4, name: "Skincare", slug: "skincare" },
          { id: 5, name: "Groceries", slug: "groceries" },
          { id: 6, name: "Home Decoration", slug: "home-decoration" }
        ]);
      }
    };

    fetchCategories();
  }, []);


  useEffect(() => {
    setCurrentProducts(products);
  }, [products]);


  useEffect(() => {
    const filterProducts = () => {
      let result = [...currentProducts];
      
     
      if (selectedCategory !== "all") {
        result = result.filter(product => {
          const productCategorySlug = product.category.toLowerCase().replace(/\s+/g, '-');
          return productCategorySlug === selectedCategory;
        });
      }
      
    
      if (searchQuery.trim()) {
        result = result.filter(product => 
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setFilteredProducts(result);
    };

    filterProducts();
  }, [searchQuery, selectedCategory, currentProducts]);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const results = await searchProducts(searchQuery);
          
          let filteredResults = results;
          if (selectedCategory !== "all") {
            filteredResults = results.filter(product => {
              const productCategorySlug = product.category.toLowerCase().replace(/\s+/g, '-');
              return productCategorySlug === selectedCategory;
            });
          }
          
          setFilteredProducts(filteredResults);
        } catch (error) {
          console.error('Search error:', error);
          setFilteredProducts([]);
        } finally {
          setIsSearching(false);
        }
      } else {
       
        let result = [...currentProducts];
        if (selectedCategory !== "all") {
          result = result.filter(product => {
            const productCategorySlug = product.category.toLowerCase().replace(/\s+/g, '-');
            return productCategorySlug === selectedCategory;
          });
        }
        setFilteredProducts(result);
      }
    };

    performSearch();
  }, [searchQuery, selectedCategory, currentProducts]);

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


  const getCategoryDisplayName = () => {
    if (selectedCategory === "all") return "All Products";
    const category = categories.find(cat => cat.slug === selectedCategory);
    return category ? category.name : selectedCategory;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50/70 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 mt-12 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80"></div>
          
        
          {searchQuery ? (
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Search Results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">"{searchQuery}"</span>
              {selectedCategory !== "all" && (
                <span className="block text-xl mt-2 text-gray-600">in {getCategoryDisplayName()}</span>
              )}
            </h2>
          ) : selectedCategory !== "all" ? (
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              {getCategoryDisplayName()}
            </h2>
          ) : (
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">Products</span>
            </h2>
          )}
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {searchQuery 
              ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} matching your search`
              : selectedCategory !== "all"
                ? `Browse our ${filteredProducts.length} ${getCategoryDisplayName().toLowerCase()}`
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

     
        {!isSearching && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? `We couldn't find any products matching "${searchQuery}"`
                : `We couldn't find any products in the ${getCategoryDisplayName()} category`
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
        
   
        {!isSearching && filteredProducts.length > 0 && (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 md:gap-10">
              {filteredProducts.map((product) => (
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