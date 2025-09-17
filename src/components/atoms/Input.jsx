import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className = "", 
  type = "text",
  error = false,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-4 py-3 border rounded-lg transition-all duration-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1";
  
  const stateClasses = error 
    ? "border-error focus:ring-error focus:border-error bg-red-50" 
    : "border-gray-300 focus:ring-primary focus:border-primary bg-white hover:border-gray-400";
  
  return (
    <input
      ref={ref}
      type={type}
      className={cn(baseClasses, stateClasses, className)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;