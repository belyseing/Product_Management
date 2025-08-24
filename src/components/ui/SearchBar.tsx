import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string, category: string) => void; 
  selectedCategory?: string; 
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, selectedCategory = "all" }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };


  const handleSearch = () => {
    if (searchTerm.trim() === "") return; 
    onSearch(searchTerm, selectedCategory);
  };

  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search products..."
        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
