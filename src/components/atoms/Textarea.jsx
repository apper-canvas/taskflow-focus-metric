import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className = "", 
  error = false,
  rows = 3,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-4 py-3 border rounded-lg transition-all duration-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1 resize-vertical";
  
  const stateClasses = error 
    ? "border-error focus:ring-error focus:border-error bg-red-50" 
    : "border-gray-300 focus:ring-primary focus:border-primary bg-white hover:border-gray-400";
  
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(baseClasses, stateClasses, className)}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;