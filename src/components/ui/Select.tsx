import React from "react";

interface SelectOption {
  value: string;
  label: string; 
}

interface SelectProps {
  options: SelectOption[]; 
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; 
  disabled?: boolean;
  error?: string;
  className?: string;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  error,
  className = "",
  placeholder = "Select an option"
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border rounded-lg px-4 py-2 outline-none transition-all duration-200 
        ${disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"} 
        ${error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-300"}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Select;