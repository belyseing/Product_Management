
function Categories() {
  const categories = [
    {
      name: "Beauty",
      image: "https://images.pexels.com/photos/3373739/pexels-photo-3373739.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      name: "Furniture",
      image: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      name: "Fragrances",
      image: "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      name: "Groceries",
      image: "https://images.pexels.com/photos/750953/pexels-photo-750953.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      name: "Electronics",
      image: "https://images.pexels.com/photos/3945651/pexels-photo-3945651.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      name: "Fashion",
      image: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ];

  return (
    <div className="px-6 py-12 bg-gradient-to-br from-slate-50 to-indigo-100"> 
      <div className="max-w-7xl mx-auto text-center">
        
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-gray-800">
            Shop by <span className="text-amber-600">Categories</span>
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Discover products across our most popular categories
          </p>
        </div>

        {/* Categories cards*/}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-2xl shadow-lg bg-white transition transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
            >
              {/*  category Image */}
              <img 
                src={category.image} 
                alt={category.name}  
                className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
              />

             
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-90"></div>

              {/* Category Name */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                <h3 className="text-white font-bold text-lg tracking-wide group-hover:scale-105 transition-transform">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;
