import React from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import FilterButton from "@/components/molecules/FilterButton";

const TaskFilters = ({ 
  searchQuery, 
  onSearchChange, 
  activeFilter, 
  onFilterChange, 
  taskCounts = {},
  className = "" 
}) => {
  const filters = [
    { 
      key: "all", 
      label: "All Tasks", 
      icon: "List", 
      count: taskCounts.all || 0 
    },
    { 
      key: "pending", 
      label: "Pending", 
      icon: "Clock", 
      count: taskCounts.pending || 0 
    },
    { 
      key: "completed", 
      label: "Completed", 
      icon: "CheckCircle", 
      count: taskCounts.completed || 0 
    }
  ];

  const priorityFilters = [
    { 
      key: "high", 
      label: "High Priority", 
      icon: "AlertTriangle", 
      count: taskCounts.high || 0 
    },
    { 
      key: "medium", 
      label: "Medium Priority", 
      icon: "Minus", 
      count: taskCounts.medium || 0 
    },
    { 
      key: "low", 
      label: "Low Priority", 
      icon: "ArrowDown", 
      count: taskCounts.low || 0 
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`space-y-6 ${className}`}
    >
      {/* Search Bar */}
      <div>
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search tasks by title or description..."
        />
      </div>

      {/* Status Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Status</h3>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <FilterButton
              key={filter.key}
              active={activeFilter === filter.key}
              onClick={() => onFilterChange(filter.key)}
              icon={filter.icon}
              count={filter.count}
            >
              {filter.label}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Priority Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Priority</h3>
        <div className="flex flex-wrap gap-2">
          {priorityFilters.map((filter) => (
            <FilterButton
              key={filter.key}
              active={activeFilter === filter.key}
              onClick={() => onFilterChange(filter.key)}
              icon={filter.icon}
              count={filter.count}
            >
              {filter.label}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFilter && activeFilter !== "all" && (
        <div className="flex justify-end">
          <button
            onClick={() => onFilterChange("all")}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1"
          >
            <span>Clear filters</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default TaskFilters;