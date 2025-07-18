import { toast } from 'react-toastify';

export const billingService = {
  async getAll() {
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
          { field: { Name: "number" } },
          { field: { Name: "contact_name" } },
          { field: { Name: "items" } },
          { field: { Name: "subtotal" } },
          { field: { Name: "tax" } },
          { field: { Name: "total" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "due_date" } },
          { field: { Name: "paid_at" } },
          { field: { Name: "contact_email" } },
          { field: { Name: "contact_address" } },
          { field: { Name: "notes" } },
          { field: { Name: "terms" } },
          { field: { Name: "contact_id" } }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("invoice", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching invoices:", error?.response?.data?.message);
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
          { field: { Name: "number" } },
          { field: { Name: "contact_name" } },
          { field: { Name: "items" } },
          { field: { Name: "subtotal" } },
          { field: { Name: "tax" } },
          { field: { Name: "total" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "due_date" } },
          { field: { Name: "paid_at" } },
          { field: { Name: "contact_email" } },
          { field: { Name: "contact_address" } },
          { field: { Name: "notes" } },
          { field: { Name: "terms" } },
          { field: { Name: "contact_id" } }
        ]
      };

      const response = await apperClient.getRecordById("invoice", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching invoice with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(invoiceData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: `INV-${Date.now()}`,
        Tags: Array.isArray(invoiceData.tags) ? invoiceData.tags.join(',') : invoiceData.Tags,
        number: `INV-${Date.now()}`,
        contact_name: invoiceData.contactName,
        items: JSON.stringify(invoiceData.items),
        subtotal: invoiceData.subtotal,
        tax: invoiceData.tax || 0,
        total: invoiceData.total,
        status: "draft",
        created_at: new Date().toISOString(),
        due_date: invoiceData.dueDate,
        contact_email: invoiceData.contactEmail,
        contact_address: invoiceData.contactAddress,
        notes: invoiceData.notes,
        terms: invoiceData.terms
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord("invoice", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create invoices ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating invoice:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, invoiceData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: invoiceData.Name || `INV-${Date.now()}`,
        Tags: Array.isArray(invoiceData.tags) ? invoiceData.tags.join(',') : invoiceData.Tags,
        number: invoiceData.number,
        contact_name: invoiceData.contactName,
        items: JSON.stringify(invoiceData.items),
        subtotal: invoiceData.subtotal,
        tax: invoiceData.tax,
        total: invoiceData.total,
        status: invoiceData.status,
        due_date: invoiceData.dueDate,
        paid_at: invoiceData.paidAt,
        contact_email: invoiceData.contactEmail,
        contact_address: invoiceData.contactAddress,
        notes: invoiceData.notes,
        terms: invoiceData.terms
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord("invoice", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update invoices ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating invoice:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord("invoice", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete invoices ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting invoice:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};