import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import PrioritySelector from "@/components/molecules/PrioritySelector";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const TaskForm = ({ 
  onSubmit, 
  initialData = null, 
  onCancel,
  isSubmitting = false 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium"
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        priority: initialData.priority || "medium"
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    
    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      await onSubmit(formData);
      if (!initialData) {
        setFormData({
          title: "",
          description: "",
          priority: "medium"
        });
      }
      setErrors({});
    } catch (error) {
      toast.error("Failed to save task");
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const isEditing = !!initialData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <ApperIcon 
            name={isEditing ? "Edit3" : "Plus"} 
            size={20} 
            className="text-primary" 
          />
          <span>{isEditing ? "Edit Task" : "Create New Task"}</span>
        </h2>
        
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 
                     transition-all duration-200"
          >
            <ApperIcon name="X" size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Task Title
          </label>
          <Input
            id="title"
            type="text"
            placeholder="What needs to be done?"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            error={!!errors.title}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-error">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <Textarea
            id="description"
            placeholder="Add more details about this task..."
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <PrioritySelector
            value={formData.priority}
            onChange={(value) => handleChange("priority", value)}
            error={!!errors.priority}
          />
          {errors.priority && (
            <p className="mt-1 text-sm text-error">{errors.priority}</p>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{isEditing ? "Updating..." : "Creating..."}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ApperIcon name={isEditing ? "Save" : "Plus"} size={16} />
                <span>{isEditing ? "Update Task" : "Create Task"}</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;