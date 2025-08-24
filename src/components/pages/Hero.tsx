import ProductForm from "../../product/ProductForm";
import { useState } from "react";

function Hero() {
  const [showForm, setShowForm] = useState(false);

  const handleProductAdded = (product: any) => {
    console.log("Product added:", product);
    
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 flex items-center justify-center p-4 relative">
      {showForm && (
        <ProductForm
          onClose={() => setShowForm(false)}
          onProductAdded={handleProductAdded}
        />
      )}
      
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Side */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-xs lg:max-w-md">
            <div className="absolute -inset-4 bg-gradient-to-r from-slate-200 to-purple-200 rounded-2xl transform -rotate-3"></div>
            <img
              src="https://images.pexels.com/photos/6214386/pexels-photo-6214386.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Shopping cart"
              className="relative rounded-xl shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Center Text */}
        <div className="flex-1 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-600 mb-2">
            Shopping And
          </h2>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Department Store.
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Shopping is a bit of a relaxing hobby for me, which is sometimes
            troubling for the bank balance.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-amber-600 hover:bg-amber-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md"
          >
            Add Product
          </button>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex justify-center lg:justify-start">
          <div className="relative w-full max-w-xs lg:max-w-md">
            <div className="absolute -inset-4 bg-gradient-to-l from-slate-200 to-pink-200 rounded-2xl transform rotate-3"></div>
            <img
              src="https://images.pexels.com/photos/6772076/pexels-photo-6772076.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Phone payment"
              className="relative rounded-xl shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;