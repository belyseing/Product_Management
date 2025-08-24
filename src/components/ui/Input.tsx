import React, { InputHTMLAttributes } from "react";


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;           
  error?: string;          
  icon?: React.ReactNode;   
}

const Input: React.FC<InputProps> = ({ label, error, icon, ...props }) => {
  return (
    <div className="flex flex-col w-full mb-4">
      {label && <label className="mb-1 font-medium text-gray-700">{label}</label>}
      <div className="relative w-full">
        {icon && <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
            ${icon ? "pl-10" : ""} 
            ${error ? "border-red-500" : "border-gray-300"}`}
          {...props} 
        />
      </div>
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default Input;
