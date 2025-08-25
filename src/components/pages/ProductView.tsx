import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { FaArrowLeft, FaEdit, FaTrash, FaStar, FaShoppingCart, FaTag, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ProductContext } from "../../context/ProductContext"; 
import { getProductById } from "../../api/productAPI"; // Import your API function

function ProductView() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { products } = useProducts();
  const productContext = useContext(ProductContext); 
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      
      const localProduct = products.find((p) => p.id.toString() === id);
      if (localProduct) {
        setProduct(localProduct);
        setLoading(false);
        return;
      }

 
      try {
        setLoading(true);
        const productData = await getProductById(Number(id));
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
        setDeleteError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Loading product...</h2>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Product not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      if (productContext) {
        await productContext.deleteExistingProduct(product.id);
        alert("Product deleted successfully!");
        navigate("/");
      } else {
        setDeleteError("Product context not available");
      }
    } catch (err: any) {
      console.error("Error deleting product:", err);
      setDeleteError("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddToCart = () => {
    console.log("Add to cart:", product);
  };

  const handleNextImage = () => {
    if (product.images && product.images.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const handlePrevImage = () => {
    if (product.images && product.images.length > 0) {
      setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const hiddenKeys = [
    "id", "thumbnail", "images", "fragrances", "perfumes", "sku", "dimensions", 
    "warrantyInformation", "reviews", "returnPolicy", "minimumOrderQuantity", "meta",
    "tags", "description", "title", "category", "rating", "stock", "price", "discountPercentage", "promotion"
  ];

  const formatKeyName = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const allImages = product.images && product.images.length > 0 
    ? [product.thumbnail, ...product.images] 
    : [product.thumbnail];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
       
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl shadow-md hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 mb-6 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back to Products</span>
        </button>

        
        {deleteError && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl border border-red-200">
            {deleteError}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
          
            <div className="lg:w-2/5 p-6 md:p-8">
              <div className="sticky top-6">
               
                <div className="relative bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-6 shadow-inner flex items-center justify-center h-80 mb-6">
                  <img
                    src={allImages[activeImageIndex]}
                    alt={`${product.title} - Image ${activeImageIndex + 1}`}
                    className="max-w-full max-h-64 object-contain rounded-xl transition-transform duration-500"
                  />
                  
                  
                  {product.discountPercentage && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg z-10">
                      {product.discountPercentage}% OFF
                    </div>
                  )}

                 
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all z-10"
                      >
                        <FaChevronLeft className="text-gray-700" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all z-10"
                      >
                        <FaChevronRight className="text-gray-700" />
                      </button>
                    </>
                  )}

                 
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {activeImageIndex + 1} / {allImages.length}
                    </div>
                  )}
                </div>

               
                {allImages.length > 1 && (
                  <div className="mb-6">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {allImages.map((img, idx) => (
                        <div 
                          key={idx} 
                          className={`flex-shrink-0 w-16 h-16 rounded-lg p-1 shadow-sm border-2 cursor-pointer transition-all ${
                            idx === activeImageIndex 
                              ? "border-indigo-500 scale-105" 
                              : "border-gray-200 hover:border-indigo-300"
                          }`}
                          onClick={() => setActiveImageIndex(idx)}
                        >
                          <img
                            src={img}
                            alt={`${product.title} - Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

               
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <FaShoppingCart />
                    <span>Add to Cart</span>
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/edit-product/${product.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-100 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-200 transition-all"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-700 font-semibold rounded-xl hover:bg-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaTrash />
                      <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="lg:w-3/5 p-6 md:p-8 border-t lg:border-t-0 lg:border-l border-gray-100">
              <div className="flex flex-col">
                {/* Category */}
                <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-sm font-semibold rounded-full mb-4">
                  {product.category}
                </span>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.title}
                </h1>

                {/* Description */}
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Rating and Stock Info */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center bg-amber-100 px-3 py-1 rounded-full">
                    <FaStar className="text-amber-500 mr-1" />
                    <span className="text-amber-700 font-semibold">
                      {product.rating?.toFixed(1) || '4.5'}
                    </span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">{product.stock} in stock</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">Brand: {product.brand || 'Unknown'}</span>
                </div>

                {/* Price Section */}
                <div className="mb-8 p-5 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    {product.discountPercentage && (
                      <span className="text-lg text-red-500 line-through">
                        ${(product.price * (1 + product.discountPercentage / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>
                  {product.promotion && (
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <FaTag className="text-green-500" />
                      <span>Promotion: {product.promotion}</span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-amber-600 mb-4 border-b border-amber-100 pb-2">Product Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(product).map((key) => {
                      if (hiddenKeys.includes(key)) return null;
                      const value = product[key as keyof typeof product];
                      if (!value || value.toString().trim() === '') return null;
                      
                      return (
                        <div key={key} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="text-sm font-medium text-gray-500 mb-1">{formatKeyName(key)}</div>
                          <div className="text-gray-900 font-semibold">{value.toString()}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductView;