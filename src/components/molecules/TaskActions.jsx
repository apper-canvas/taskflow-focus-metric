import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TaskActions = ({ 
  onEdit, 
  onDelete, 
  onDuplicate,
  className = "" 
}) => {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {onDuplicate && (
        <button
          onClick={onDuplicate}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 
                   transition-all duration-200 group"
          title="Duplicate task"
        >
          <ApperIcon 
            name="Copy" 
            size={16} 
            className="group-hover:scale-110 transition-transform duration-200" 
          />
        </button>
      )}
      
      <button
        onClick={onEdit}
        className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 
                 transition-all duration-200 group"
        title="Edit task"
      >
        <ApperIcon 
          name="Edit3" 
          size={16} 
          className="group-hover:scale-110 transition-transform duration-200" 
        />
      </button>
      
      <button
        onClick={onDelete}
        className="p-2 rounded-lg text-gray-400 hover:text-error hover:bg-red-50 
                 transition-all duration-200 group"
        title="Delete task"
      >
        <ApperIcon 
          name="Trash2" 
          size={16} 
          className="group-hover:scale-110 transition-transform duration-200" 
        />
      </button>
    </div>
  );
};

export default TaskActions;