import { toast } from 'react-toastify';

export const pipelineService = {
  async getPipelines() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "stages" } },
          { field: { Name: "color" } },
          { field: { Name: "is_default" } }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("pipeline", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching pipelines:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

async getLeads() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "company" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "pipeline_id" } },
          { field: { Name: "last_activity" } },
          { field: { Name: "source" } },
          { field: { Name: "notes" } },
          { field: { Name: "owner_id" } }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("lead", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to UI-expected property names
      const leads = (response.data || []).map(lead => ({
        ...lead,
        // Map database "Name" to UI-expected "name"
        name: lead.Name || lead.name || '',
        // Map lookup fields if they exist
        owner: lead.Owner?.Name || lead.owner || 'Unassigned',
        // Map date fields
        lastActivity: lead.last_activity || lead.lastActivity,
        // Ensure other fields maintain compatibility
        pipelineId: lead.pipeline_id || lead.pipelineId,
        ownerId: lead.owner_id || lead.ownerId
      }));

      return leads;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching leads:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getStages() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "color" } },
          { field: { Name: "order" } }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("stage", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching stages:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "company" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "pipeline_id" } },
          { field: { Name: "last_activity" } },
          { field: { Name: "source" } },
          { field: { Name: "notes" } },
          { field: { Name: "owner_id" } }
        ]
      };

      const response = await apperClient.getRecordById("lead", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching lead with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(leadData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: leadData.name || leadData.Name,
        Tags: Array.isArray(leadData.tags) ? leadData.tags.join(',') : leadData.Tags,
        company: leadData.company,
        email: leadData.email,
        phone: leadData.phone,
        value: parseFloat(leadData.value) || 0,
        stage: leadData.stage,
        pipeline_id: leadData.pipelineId || 1,
        last_activity: new Date().toISOString(),
        source: leadData.source,
        notes: leadData.notes
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord("lead", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create leads ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating lead:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async updateLead(id, leadData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: leadData.name || leadData.Name,
        Tags: Array.isArray(leadData.tags) ? leadData.tags.join(',') : leadData.Tags,
        company: leadData.company,
        email: leadData.email,
        phone: leadData.phone,
        value: parseFloat(leadData.value) || 0,
        stage: leadData.stage,
        pipeline_id: leadData.pipelineId,
        last_activity: new Date().toISOString(),
        source: leadData.source,
        notes: leadData.notes
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord("lead", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update leads ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating lead:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("lead", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete leads ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting lead:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

async getAll() {
    return this.getLeads();
  },

  async updateMultiplePipelines(pipelineUpdates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Prepare updateable data for each pipeline
      const updateableRecords = pipelineUpdates.map(pipeline => ({
        Id: parseInt(pipeline.Id),
        Name: pipeline.name || pipeline.Name,
        Tags: Array.isArray(pipeline.tags) ? pipeline.tags.join(',') : pipeline.Tags,
        stages: pipeline.stages,
        color: pipeline.color,
        is_default: pipeline.is_default
      }));

      const params = {
        records: updateableRecords
      };

      const response = await apperClient.updateRecord("pipeline", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update pipelines ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success(`Successfully updated ${successfulUpdates.length} pipeline(s)`);
        }
        
        return successfulUpdates.map(result => result.data);
      }

      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating multiple pipelines:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};