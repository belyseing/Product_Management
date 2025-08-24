import React from "react";


type ButtonColor = "add" | "delete" | "edit" | "view" | "addToCart";
type ButtonSize = "sm" | "md" | "lg";



interface ButtonProps {
  label : string;
  color?: ButtonColor;
  size?: ButtonSize;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}


const buttonColors = {
 add: "bg-green-600 hover:bg-green-500 text-white",
  delete: "bg-red-600 hover:bg-red-500 text-white",
  edit: "bg-amber-600 hover:bg-amber-500 text-white",
  view: "bg-gray-600 hover:bg-gray-500 text-white",
  addToCart: "bg-amber-600 hover:bg-amber-500 text-white",
}

const buttonSizes = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};



const Button: React.FC<ButtonProps> = ({
   label,
  color = "add",
   size = "md",
  onClick,
  icon,
  disabled = false,
}) => {
    return (
        <button onClick={onClick} disabled={disabled} className={`flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 shadow-md ${buttonColors[color]} ${buttonSizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
            {icon && <span>{icon}</span>}
            {label}
        </button>

    )
}


export default Button;