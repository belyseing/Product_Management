import { SiCoinmarketcap } from "react-icons/si";
import { FaAngleDown, FaUserAlt } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom"; 
import { useState, useEffect, useRef } from "react";
import { searchProducts, getCategories } from "../../api/productAPI";
import { Product } from "../../types/product";

interface Category {
  id: number;
  name: string;
  slug: string;
}

function Header() {
  const { cart } = useCart(); 
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim().length > 1) {
        performSearch();
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    }, 300); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const performSearch = async () => {
    setIsSearching(true);
    try {
      const results = await searchProducts(searchTerm);
      setSearchResults(results.slice(0, 5));
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    } else if (selectedCategory !== "all") {
      navigate(`/?category=${encodeURIComponent(selectedCategory)}`);
    } else {
      navigate('/'); 
    }
    setShowSuggestions(false);
    setShowCategoryDropdown(false);
  };

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setShowCategoryDropdown(false);
    
    if (categorySlug === "all") {
      navigate('/'); 
    } else {
      navigate(`/?category=${encodeURIComponent(categorySlug)}`);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    setSearchTerm(product.title);
    setShowSuggestions(false);
    navigate(`/product/${product.id}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
    setShowSuggestions(false);
  };


  const getCategoryDisplayName = () => {
    if (selectedCategory === "all") return "Categories";
    const category = categories.find(cat => cat.slug === selectedCategory);
    return category ? category.name : selectedCategory;
  };

  return (
    <div className="flex justify-between items-center bg-slate-700 text-white px-6 py-4">
      <div className="flex items-center gap-2">
        <SiCoinmarketcap className="text-3xl text-slate-300" />
        <h1 className="text-2xl font-bold">Shop<span className="text-amber-500">cart</span></h1>
      </div>

      
      <div className="flex flex-1 justify-center">
        <div className="relative w-full max-w-2xl" ref={searchRef}>
          <div className="flex items-center bg-white rounded-md overflow-hidden">
           
            <div className="relative">
              <div 
                className="flex items-center gap-1 bg-gray-100 px-4 py-3 cursor-pointer border-r"
                onClick={toggleCategoryDropdown}
              >
                <p className="text-black">
                  {getCategoryDisplayName()}
                </p>
                <FaAngleDown className="text-black" />
              </div>
              
            
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto w-48">
                  <div
                    className={`p-3 hover:bg-gray-100 cursor-pointer border-b ${
                      selectedCategory === "all" ? "bg-amber-100 font-semibold" : ""
                    }`}
                    onClick={() => handleCategorySelect("all")}
                  >
                    All Categories
                  </div>
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`p-3 hover:bg-gray-100 cursor-pointer border-b ${
                        selectedCategory === category.slug ? "bg-amber-100 font-semibold" : ""
                      }`}
                      onClick={() => handleCategorySelect(category.slug)}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
           
            <input
              type="text"
              placeholder="Search for Product..."
              className="flex-1 px-4 py-3 text-black focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
            />
            
           
            <button 
              className="bg-amber-500 px-6 py-3 font-semibold text-black hover:bg-amber-400 transition"
              onClick={handleSearchSubmit}
            >
              Search
            </button>
          </div>

          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-gray-500 text-center">Searching...</div>
              ) : searchResults.length > 0 ? (
                <>
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                      onClick={() => handleSuggestionClick(product)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{product.title}</p>
                          <p className="text-xs text-gray-500">${product.price}</p>
                          <p className="text-xs text-gray-400 capitalize">{product.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              
                  <div
                    className="p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer text-center font-semibold text-blue-600"
                    onClick={handleSearchSubmit}
                  >
                    View all results for "{searchTerm}"
                  </div>
                </>
              ) : searchTerm.length > 1 ? (
                <div className="p-4 text-gray-500 text-center">No products found</div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 mr-4">
    
        <div className="flex items-center gap-2">
          <FaUserAlt
            className="bg-amber-400 rounded-full p-2"
            size={32} 
          />
          <p className="text-lg font-medium">Emily</p>
        </div>

    
        <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
          <FaCartShopping className="text-3xl" />
          {cart.totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cart.totalItems}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header;