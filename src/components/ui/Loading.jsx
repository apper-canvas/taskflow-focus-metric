import React from "react";

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start space-x-4">
              <div className="w-5 h-5 bg-gray-200 rounded-md flex-shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-4 bg-gray-100 rounded-md w-full"></div>
                <div className="h-4 bg-gray-100 rounded-md w-2/3"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-gray-200 rounded-md w-20"></div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Form skeleton */}
      <div className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded-md w-32"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded-md w-16"></div>
            <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded-md w-20"></div>
            <div className="h-24 bg-gray-100 rounded-lg w-full"></div>
          </div>
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded-md w-12"></div>
              <div className="h-10 bg-gray-100 rounded-lg w-32"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-lg w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;