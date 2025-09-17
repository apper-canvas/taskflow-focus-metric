import tasksData from "@/services/mockData/tasks.json";

// Simulate API delay for realistic loading states
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem("taskflow-tasks");
      if (stored) {
        this.tasks = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading tasks from storage:", error);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem("taskflow-tasks", JSON.stringify(this.tasks));
    } catch (error) {
      console.error("Error saving tasks to storage:", error);
    }
  }

  async getAll() {
    await delay(300);
    return [...this.tasks].sort((a, b) => a.order - b.order);
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.Id === parseInt(id));
    return task ? { ...task } : null;
  }

  async create(taskData) {
    await delay(400);
    
    const maxId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.Id)) : 0;
    const maxOrder = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.order)) : 0;
    
    const newTask = {
      Id: maxId + 1,
      title: taskData.title || "",
      description: taskData.description || "",
      priority: taskData.priority || "medium",
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      order: maxOrder + 1
    };

    this.tasks.push(newTask);
    this.saveToStorage();
    return { ...newTask };
  }

  async update(id, taskData) {
    await delay(300);
    
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }

    const currentTask = this.tasks[index];
    const updatedTask = {
      ...currentTask,
      ...taskData,
      Id: currentTask.Id, // Preserve ID
      createdAt: currentTask.createdAt, // Preserve creation date
      completedAt: taskData.completed && !currentTask.completed 
        ? new Date().toISOString() 
        : !taskData.completed 
        ? null 
        : currentTask.completedAt
    };

    this.tasks[index] = updatedTask;
    this.saveToStorage();
    return { ...updatedTask };
  }

  async delete(id) {
    await delay(250);
    
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }

    const deletedTask = this.tasks.splice(index, 1)[0];
    this.saveToStorage();
    return { ...deletedTask };
  }

  async updateOrder(taskIds) {
    await delay(200);
    
    taskIds.forEach((id, index) => {
      const task = this.tasks.find(t => t.Id === parseInt(id));
      if (task) {
        task.order = index + 1;
      }
    });

    this.saveToStorage();
    return [...this.tasks].sort((a, b) => a.order - b.order);
  }

  async getByStatus(status) {
    await delay(250);
    let filtered = [...this.tasks];
    
    if (status === "completed") {
      filtered = filtered.filter(t => t.completed);
    } else if (status === "pending") {
      filtered = filtered.filter(t => !t.completed);
    }
    
    return filtered.sort((a, b) => a.order - b.order);
  }

  async getByPriority(priority) {
    await delay(250);
    const filtered = this.tasks.filter(t => t.priority === priority);
    return filtered.sort((a, b) => a.order - b.order);
  }

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
      return this.getAll();
    }
    
    const filtered = this.tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm)
    );
    
    return filtered.sort((a, b) => a.order - b.order);
  }
}

export default new TaskService();