import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No tasks found",
  message = "Get started by creating your first task and stay organized!",
  actionText = "Create Task",
  onAction,
  icon = "CheckSquare",
  className = "" 
}) => {
  return (
    <div className={`text-center py-16 px-6 ${className}`}>
      <div className="max-w-sm mx-auto">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 
                         rounded-full flex items-center justify-center">
            <ApperIcon 
              name={icon} 
              size={40}
              className="text-primary"
            />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">
              {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {message}
            </p>
          </div>
          
          {onAction && (
            <button
              onClick={onAction}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 
                       hover:to-secondary/90 text-white px-8 py-3 rounded-xl font-medium
                       transition-all duration-300 flex items-center space-x-2 group
                       shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ApperIcon 
                name="Plus" 
                size={18}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span>{actionText}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Empty;