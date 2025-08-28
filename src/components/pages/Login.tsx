import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { FormData, FormErrors } from "../types/user";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): FormErrors => {
    const errors: FormErrors = {};
    if (!formData.username.trim()) errors.username = "Please enter your username";
    if (!formData.password) errors.password = "Please enter your password";
    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const result = await login(formData.username, formData.password);
    setLoading(false);

    if (result.success) {
      navigate("/productList");
    } else {
      setErrors({ general: result.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-xl bg-slate-700 text-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <div className="lg:w-1/2 relative h-64 lg:h-auto overflow-hidden">
          <img
            src="https://images.pexels.com/photos/6214386/pexels-photo-6214386.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Shopping experience"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute bottom-4 left-4 z-20 max-w-xs">
            <h2 className="text-lg font-bold text-amber-400 mb-1"> <span className="text-white">Welcome back to</span> ShopCart</h2>
            <p className="text-xs text-white/80">
              Discover the latest products and exclusive collections.
            </p>
          </div>
        </div>

       
        <div className="lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            
            <div className="flex justify-center mb-4">
              <span className="text-lg font-bold text-amber-400"></span>
            </div>

            <div className="text-center mb-12">
              <h1 className="text-2xl font-bold text-white mb-1">Shop<span className="text-amber-500">Cart</span></h1>
              <p className="text-gray-300 text-xs">Sign in to access your cart</p>
            </div>

            {errors.general && (
              <div className="bg-red-600/20 border-l-4 border-red-500 text-red-200 p-2 rounded mb-3 flex items-center text-xs">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-medium text-gray-200 mb-1">Username or Email</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-2 pr-2 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all duration-300 text-slate-900`}
                  placeholder="Enter your username or email"
                  disabled={loading}
                />
                {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-gray-200 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-2 pr-8 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all duration-300 text-slate-900`}
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-amber-400 transition-colors duration-300"
                    disabled={loading}
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="mr-2"
                    disabled={loading}
                  />
                  Remember me
                </label>
                <a href="#" className="text-amber-400 hover:text-amber-300 font-medium">Forgot password?</a>
              </div>

         
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 text-white font-medium py-2  rounded-lg transition-all duration-300 hover:bg-amber-400 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-xs"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="mt-4 text-center text-xs text-gray-300">
              Don't have an account?{" "}
              <a href="#" className="text-amber-400 hover:text-amber-300 font-medium underline">
               register
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
