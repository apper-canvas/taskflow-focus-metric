import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const FilterButton = ({ 
  active = false, 
  onClick, 
  children, 
  icon,
  count,
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 group",
        active 
          ? "bg-primary text-white shadow-md transform -translate-y-0.5" 
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm",
        className
      )}
    >
      {icon && (
        <ApperIcon 
          name={icon} 
          size={16} 
          className={cn(
            "transition-transform duration-200",
            active ? "text-white" : "text-gray-500 group-hover:text-gray-700"
          )}
        />
      )}
      <span>{children}</span>
      {count !== undefined && (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-xs font-semibold",
          active 
            ? "bg-white/20 text-white" 
            : "bg-gray-200 text-gray-600"
        )}>
          {count}
        </span>
      )}
    </button>
  );
};

export default FilterButton;