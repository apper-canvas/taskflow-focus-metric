import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  children,
  className = "", 
  error = false,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-4 py-3 border rounded-lg transition-all duration-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white appearance-none cursor-pointer";
  
  const stateClasses = error 
    ? "border-error focus:ring-error focus:border-error" 
    : "border-gray-300 focus:ring-primary focus:border-primary hover:border-gray-400";
  
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(baseClasses, stateClasses, className)}
        {...props}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ApperIcon 
          name="ChevronDown" 
          size={18} 
          className="text-gray-500" 
        />
      </div>
    </div>
  );
});

Select.displayName = "Select";

export default Select;