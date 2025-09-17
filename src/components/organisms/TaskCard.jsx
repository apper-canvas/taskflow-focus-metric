import React, { useState } from "react";
import { motion } from "framer-motion";
import { format, isToday, isYesterday } from "date-fns";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import TaskActions from "@/components/molecules/TaskActions";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  onDuplicate,
  isDragging = false,
  className = "" 
}) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    try {
      await onToggleComplete(task.Id, !task.completed);
    } finally {
      setIsCompleting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "border-l-error";
      case "medium": return "border-l-warning";
      case "low": return "border-l-info";
      default: return "border-l-gray-300";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
  };

  const priorityLabels = {
    high: "High",
    medium: "Medium", 
    low: "Low"
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-surface rounded-xl p-6 shadow-sm border-l-4 border border-gray-100",
        "hover:shadow-md transition-all duration-200",
        getPriorityColor(task.priority),
        task.completed && "opacity-75",
        isDragging && "task-dragging shadow-xl",
        className
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 pt-1">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isCompleting}
            className={cn(
              "transition-all duration-300",
              isCompleting && "animate-pulse"
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <h3 className={cn(
              "text-lg font-semibold leading-tight",
              task.completed 
                ? "text-gray-500 line-through" 
                : "text-gray-900"
            )}>
              {task.title}
            </h3>
            
            <Badge variant={task.priority} size="sm">
              {priorityLabels[task.priority]}
            </Badge>
          </div>

          {task.description && (
            <p className={cn(
              "text-sm leading-relaxed mb-4",
              task.completed 
                ? "text-gray-400 line-through" 
                : "text-gray-600"
            )}>
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <ApperIcon name="Calendar" size={14} />
                <span>Created {formatDate(task.createdAt)}</span>
              </span>
              
              {task.completed && task.completedAt && (
                <span className="flex items-center space-x-1 text-success">
                  <ApperIcon name="CheckCircle" size={14} />
                  <span>Completed {formatDate(task.completedAt)}</span>
                </span>
              )}
            </div>

            <TaskActions
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.Id)}
              onDuplicate={() => onDuplicate(task)}
            />
          </div>
        </div>
      </div>

      {/* Drag handle */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
        <ApperIcon 
          name="GripVertical" 
          size={16} 
          className="text-gray-400" 
        />
      </div>
    </motion.div>
  );
};

export default TaskCard;