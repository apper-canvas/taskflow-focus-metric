import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Checkbox = forwardRef(({ 
  className = "", 
  checked = false,
  onChange,
  ...props 
}, ref) => {
  const baseClasses = "custom-checkbox";
  
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={cn(baseClasses, className)}
      {...props}
    />
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;