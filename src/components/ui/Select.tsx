import React from "react";

interface SelectOption {
  value: string;
}

interface SelectProps {
  options: SelectOption[]; 
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; 
  disabled?: boolean;
  error?: string;
  className?: string; 
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  error,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border rounded-lg px-4 py-2 outline-none transition-all duration-200 
        ${disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"} 
        ${error ? "border-red-500" : "border-gray-300"}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
          </option>
        ))}
      </select>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Select;
