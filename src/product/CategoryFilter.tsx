import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCategories } from "../api/productAPI";
import Select from "../components/ui/Select";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategoryFilterProps {
  onCategoryChange?: (categorySlug: string) => void;
  className?: string;
  showAllOption?: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  onCategoryChange,
  className = "",
  showAllOption = true
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [location.search]);

 
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categorySlug = e.target.value;
    setSelectedCategory(categorySlug);

    
    if (onCategoryChange) {
      onCategoryChange(categorySlug);
    }

if (categorySlug === "all") {
  navigate('/product/:id');
} else {
  navigate(`/product/:id?category=${encodeURIComponent(categorySlug)}`);
}

  };

 
  const categoryOptions = [
    ...(showAllOption ? [{ value: "all", label: "All Categories" }] : []),
    ...categories.map(cat => ({
      value: cat.slug,
      label: cat.name
    }))
  ];

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-10 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Select
        options={categoryOptions}
        value={selectedCategory}
        onChange={handleCategoryChange}
        placeholder="Select Category"
        className="w-full"
      />
    </div>
  );
};

export default CategoryFilter;