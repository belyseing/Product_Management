
import { SiCoinmarketcap } from "react-icons/si";
import { FaAngleDown } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";

function Header() {
  return (
   <div className="flex justify-between items-center bg-slate-700 text-white px-6 py-4">
  {/*  Logo */}
  <div className="flex items-center gap-2">
    <SiCoinmarketcap className="text-3xl text-slate-300" />
    <h1 className="text-2xl font-bold">Shop<span className="text-amber-500">cart</span></h1>
  </div>

  {/* Search Bar */}
  <div className="flex flex-1 justify-center">
    <div className="flex items-center bg-white rounded-md overflow-hidden w-full max-w-2xl">
      {/* Categories */}
      <div className="flex items-center gap-1 bg-gray-100 px-4 py-3 cursor-pointer border-r">
        <p className="text-black">Categories</p>
        <FaAngleDown className="text-black" />
      </div>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for Product..."
        className="flex-1 px-4 py-3 text-black focus:outline-none"
      />
      <button className="bg-amber-500 px-6 py-3 font-semibold text-black hover:bg-amber-400 transition">
        Search
      </button>
    </div>
  </div>


<div className="flex items-center gap-6 mr-4">
  {/* user */}
  <div className="flex items-center gap-2">
    <FaUserAlt
      className=" bg-amber-400 rounded-full p-2"
      size={32} 
    />
    <p className="text-lg font-medium">Emily</p>
  </div>

  {/* Cart */}
  <FaCartShopping className="text-3xl cursor-pointer" />
</div>

</div>

  )
}

export default Header
