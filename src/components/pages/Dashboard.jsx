import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import TaskForm from "@/components/organisms/TaskForm";
import TaskFilters from "@/components/organisms/TaskFilters";
import TaskList from "@/components/organisms/TaskList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import taskService from "@/services/api/taskService";
import { cn } from "@/utils/cn";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Filter and search tasks
  useEffect(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
filtered = filtered.filter(task =>
        task.title_c.toLowerCase().includes(query) ||
        task.description_c.toLowerCase().includes(query)
      );
    }

    // Apply status and priority filters
    switch (activeFilter) {
      case "completed":
filtered = filtered.filter(task => task.completed_c);
        break;
      case "pending":
        filtered = filtered.filter(task => !task.completed_c);
        break;
      case "high":
      case "medium":
      case "low":
        filtered = filtered.filter(task => task.priority_c === activeFilter);
        break;
      default:
        // "all" - no additional filtering
        break;
    }

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, activeFilter]);

  const getTaskCounts = () => {
return {
      all: tasks.length,
      pending: tasks.filter(t => !t.completed_c).length,
      completed: tasks.filter(t => t.completed_c).length,
      high: tasks.filter(t => t.priority_c === "high").length,
      medium: tasks.filter(t => t.priority_c === "medium").length,
      low: tasks.filter(t => t.priority_c === "low").length
    };
  };

const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed_c).length;
    const pending = tasks.filter(t => !t.completed).length;
    return { total, completed, pending };
  };

  const handleCreateTask = async (taskData) => {
    try {
      setIsSubmitting(true);
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      setShowForm(false);
      toast.success("Task created successfully!");
    } catch (err) {
      toast.error("Failed to create task");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    
    try {
      setIsSubmitting(true);
      const updatedTask = await taskService.update(editingTask.Id, taskData);
      setTasks(prev => prev.map(task => 
        task.Id === editingTask.Id ? updatedTask : task
      ));
      setEditingTask(null);
      toast.success("Task updated successfully!");
    } catch (err) {
      toast.error("Failed to update task");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
const updatedTask = await taskService.update(taskId, { completed_c: completed });
      setTasks(prev => prev.map(task =>
        task.Id === taskId ? updatedTask : task
      ));
      toast.success(completed ? "Task completed! 🎉" : "Task marked as pending");
    } catch (err) {
      toast.error("Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const handleDuplicateTask = async (task) => {
try {
      const duplicateData = {
        title_c: `Copy of ${task.title_c}`,
        description_c: task.description_c,
        priority_c: task.priority_c
      };
      const newTask = await taskService.create(duplicateData);
      setTasks(prev => [...prev, newTask]);
      toast.success("Task duplicated successfully!");
    } catch (err) {
      toast.error("Failed to duplicate task");
    }
  };

  const handleReorderTasks = async (taskIds) => {
    try {
      const reorderedTasks = await taskService.updateOrder(taskIds);
      setTasks(reorderedTasks);
    } catch (err) {
      toast.error("Failed to reorder tasks");
      // Reload tasks to restore original order
      loadTasks();
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Error message={error} onRetry={loadTasks} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <Header taskStats={getTaskStats()} />

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar - Filters & Form */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100">
                <TaskFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  taskCounts={getTaskCounts()}
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleNewTask}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    <ApperIcon name="Plus" size={18} />
                    <span>New Task</span>
                  </Button>
                  
{tasks.filter(t => !t.completed_c).length > 0 && (
                    <Button
                      onClick={() => setActiveFilter("pending")}
                      variant="secondary"
                      size="lg"
                      className="w-full"
                    >
                      <ApperIcon name="Clock" size={18} />
<span>View Pending ({tasks.filter(t => !t.completed_c).length})</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Task Form */}
              {(showForm || editingTask) && (
                <TaskForm
                  onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                  initialData={editingTask}
                  onCancel={editingTask ? handleCancelEdit : () => setShowForm(false)}
                  isSubmitting={isSubmitting}
                />
              )}

              {/* Results Summary */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeFilter === "all" ? "All Tasks" :
                     activeFilter === "completed" ? "Completed Tasks" :
                     activeFilter === "pending" ? "Pending Tasks" :
                     `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Priority Tasks`}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} 
                    {searchQuery && ` matching "${searchQuery}"`}
                  </p>
                </div>

                {!showForm && !editingTask && (
                  <Button
                    onClick={handleNewTask}
                    variant="outline"
                    size="sm"
                  >
                    <ApperIcon name="Plus" size={16} />
                    <span>Add Task</span>
                  </Button>
                )}
              </div>

              {/* Task List */}
              <TaskList
                tasks={filteredTasks}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onDuplicate={handleDuplicateTask}
                onReorder={handleReorderTasks}
                onCreateTask={handleNewTask}
                emptyMessage={
                  searchQuery ? "No tasks match your search" :
                  activeFilter === "completed" ? "No completed tasks yet" :
                  activeFilter === "pending" ? "No pending tasks" :
                  activeFilter !== "all" ? `No ${activeFilter} priority tasks` :
                  "No tasks found"
                }
                emptyIcon={
                  activeFilter === "completed" ? "CheckCircle" :
                  activeFilter === "pending" ? "Clock" :
                  "CheckSquare"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;