class TaskService {
  constructor() {
    // Initialize ApperClient for database operations
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}}, 
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "order_c"}}
        ],
        orderBy: [{"fieldName": "order_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform database records to match component expectations
      return response.data.map(task => this.transformFromDatabase(task));
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}}, 
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "order_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.data) {
        return null;
      }

      return this.transformFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(taskData) {
    try {
      // Get max order for new task
      const existingTasks = await this.getAll();
      const maxOrder = existingTasks.length > 0 ? Math.max(...existingTasks.map(t => t.order_c || 0)) : 0;

      // Prepare data with only Updateable fields
      const params = {
        records: [{
          title_c: taskData.title_c || taskData.title || "",
          description_c: taskData.description_c || taskData.description || "",
          priority_c: taskData.priority_c || taskData.priority || "medium",
          completed_c: taskData.completed_c !== undefined ? taskData.completed_c : (taskData.completed || false),
          created_at_c: taskData.created_at_c || new Date().toISOString(),
          completed_at_c: taskData.completed_at_c || null,
          order_c: taskData.order_c || maxOrder + 1
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error creating task:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }

        if (successful.length > 0) {
          return this.transformFromDatabase(successful[0].data);
        }
      }

      throw new Error("Failed to create task");
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      // Prepare data with only Updateable fields
      const updateData = {
        Id: parseInt(id)
      };

      // Only include fields that are being updated
      if (taskData.title_c !== undefined || taskData.title !== undefined) {
        updateData.title_c = taskData.title_c || taskData.title;
      }
      if (taskData.description_c !== undefined || taskData.description !== undefined) {
        updateData.description_c = taskData.description_c || taskData.description;
      }
      if (taskData.priority_c !== undefined || taskData.priority !== undefined) {
        updateData.priority_c = taskData.priority_c || taskData.priority;
      }
      if (taskData.completed_c !== undefined || taskData.completed !== undefined) {
        updateData.completed_c = taskData.completed_c !== undefined ? taskData.completed_c : taskData.completed;
        
        // Set completed_at_c when marking as completed
        if (updateData.completed_c && !taskData.completed_at_c) {
          updateData.completed_at_c = new Date().toISOString();
        } else if (!updateData.completed_c) {
          updateData.completed_at_c = null;
        }
      }
      if (taskData.order_c !== undefined || taskData.order !== undefined) {
        updateData.order_c = taskData.order_c || taskData.order;
      }

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error updating task:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }

        if (successful.length > 0) {
          return this.transformFromDatabase(successful[0].data);
        }
      }

      throw new Error("Failed to update task");
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error deleting task:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async updateOrder(taskIds) {
    try {
      // Update order for multiple tasks
      const updatePromises = taskIds.map(async (id, index) => {
        return this.update(id, { order_c: index + 1 });
      });

      const results = await Promise.all(updatePromises);
      
      // Return sorted tasks
      return results.sort((a, b) => (a.order_c || 0) - (b.order_c || 0));
    } catch (error) {
      console.error("Error updating task order:", error);
      throw error;
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "order_c"}}
        ],
        where: [],
        orderBy: [{"fieldName": "order_c", "sorttype": "ASC"}]
      };

      if (status === "completed") {
        params.where.push({"FieldName": "completed_c", "Operator": "ExactMatch", "Values": [true]});
      } else if (status === "pending") {
        params.where.push({"FieldName": "completed_c", "Operator": "ExactMatch", "Values": [false]});
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching tasks by status:", response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(task => this.transformFromDatabase(task));
    } catch (error) {
      console.error("Error fetching tasks by status:", error);
      throw error;
    }
  }

  async getByPriority(priority) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "order_c"}}
        ],
        where: [{"FieldName": "priority_c", "Operator": "ExactMatch", "Values": [priority]}],
        orderBy: [{"fieldName": "order_c", "sorttype": "ASC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching tasks by priority:", response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(task => this.transformFromDatabase(task));
    } catch (error) {
      console.error("Error fetching tasks by priority:", error);
      throw error;
    }
  }

  async search(query) {
    try {
      if (!query || !query.trim()) {
        return this.getAll();
      }

      const searchTerm = query.toLowerCase().trim();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "order_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [{
            "conditions": [
              {"fieldName": "title_c", "operator": "Contains", "values": [searchTerm]},
              {"fieldName": "description_c", "operator": "Contains", "values": [searchTerm]}
            ],
            "operator": "OR"
          }]
        }],
        orderBy: [{"fieldName": "order_c", "sorttype": "ASC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error searching tasks:", response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(task => this.transformFromDatabase(task));
    } catch (error) {
      console.error("Error searching tasks:", error);
      throw error;
    }
  }

  // Transform database record to component format
  transformFromDatabase(dbRecord) {
    return {
      Id: dbRecord.Id,
      Name: dbRecord.Name,
      Tags: dbRecord.Tags,
      Owner: dbRecord.Owner,
      CreatedOn: dbRecord.CreatedOn,
      CreatedBy: dbRecord.CreatedBy,
      ModifiedOn: dbRecord.ModifiedOn,
      ModifiedBy: dbRecord.ModifiedBy,
      title_c: dbRecord.title_c,
      description_c: dbRecord.description_c,
      priority_c: dbRecord.priority_c,
      completed_c: dbRecord.completed_c,
      created_at_c: dbRecord.created_at_c,
      completed_at_c: dbRecord.completed_at_c,
      order_c: dbRecord.order_c,
      // Legacy field mappings for component compatibility
      title: dbRecord.title_c,
      description: dbRecord.description_c,
      priority: dbRecord.priority_c,
      completed: dbRecord.completed_c,
      createdAt: dbRecord.created_at_c,
      completedAt: dbRecord.completed_at_c,
      order: dbRecord.order_c
    };
  }
}

const taskService = new TaskService();
export default taskService;