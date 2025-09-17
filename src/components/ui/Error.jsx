import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  className = "" 
}) => {
  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      <div className="bg-surface rounded-xl p-8 shadow-sm border border-red-100 max-w-md mx-auto">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <ApperIcon 
              name="AlertTriangle" 
              size={32}
              className="text-red-500"
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {message}
            </p>
          </div>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium
                       transition-all duration-200 flex items-center space-x-2 group
                       shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <ApperIcon 
                name="RefreshCw" 
                size={16}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
              <span>Try Again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Error;