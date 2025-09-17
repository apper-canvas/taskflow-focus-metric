import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "@/components/organisms/TaskCard";
import Empty from "@/components/ui/Empty";

const TaskList = ({ 
  tasks, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  onDuplicate,
  onReorder,
  onCreateTask,
  emptyMessage = "No tasks found",
  emptyIcon = "CheckSquare"
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const dragCounter = useRef(0);

  if (tasks.length === 0) {
    return (
      <Empty
        title={emptyMessage}
        message="Get organized and boost your productivity by creating your first task!"
        actionText="Create Task"
        onAction={onCreateTask}
        icon={emptyIcon}
        className="py-12"
      />
    );
  }

  const handleDragStart = (e, taskId) => {
    setDraggedItem(taskId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
    e.dataTransfer.setDragImage(e.target, 0, 0);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
    dragCounter.current = 0;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e, taskId) => {
    e.preventDefault();
    dragCounter.current++;
    
    if (draggedItem && taskId !== draggedItem) {
      setDragOverItem(taskId);
    }
  };

  const handleDragLeave = (e) => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverItem(null);
    }
  };

  const handleDrop = (e, targetTaskId) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetTaskId) {
      return;
    }

    const draggedIndex = tasks.findIndex(task => task.Id === draggedItem);
    const targetIndex = tasks.findIndex(task => task.Id === targetTaskId);

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);

    const reorderedIds = newTasks.map(task => task.Id);
    onReorder(reorderedIds);

    setDraggedItem(null);
    setDragOverItem(null);
    dragCounter.current = 0;
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <div
            key={task.Id}
            draggable
            onDragStart={(e) => handleDragStart(e, task.Id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, task.Id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, task.Id)}
            className={`group relative ${
              dragOverItem === task.Id ? "task-drag-over" : ""
            }`}
          >
            <TaskCard
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              isDragging={draggedItem === task.Id}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;