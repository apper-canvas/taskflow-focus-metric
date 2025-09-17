import React from "react";
import Select from "@/components/atoms/Select";

const PrioritySelector = ({ value, onChange, error = false, className = "" }) => {
  return (
    <Select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      error={error}
      className={className}
    >
      <option value="">Select Priority</option>
      <option value="low">Low Priority</option>
      <option value="medium">Medium Priority</option>
      <option value="high">High Priority</option>
    </Select>
  );
};

export default PrioritySelector;