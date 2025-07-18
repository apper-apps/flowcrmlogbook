import mockPipelines from "@/services/mockData/pipelines.json";
import mockLeads from "@/services/mockData/leads.json";
import mockStages from "@/services/mockData/stages.json";

export const pipelineService = {
  async getPipelines() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockPipelines];
  },

  async getLeads() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockLeads];
  },

  async getStages() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockStages];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockLeads.find(lead => lead.Id === id);
  },

  async create(leadData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newLead = {
      ...leadData,
      Id: Math.max(...mockLeads.map(l => l.Id)) + 1,
      lastActivity: new Date().toISOString()
    };
    mockLeads.push(newLead);
    return newLead;
  },

  async updateLead(id, leadData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockLeads.findIndex(lead => lead.Id === id);
    if (index !== -1) {
      mockLeads[index] = { ...mockLeads[index], ...leadData };
      return mockLeads[index];
    }
    throw new Error("Lead not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockLeads.findIndex(lead => lead.Id === id);
    if (index !== -1) {
      mockLeads.splice(index, 1);
      return true;
    }
throw new Error("Lead not found");
  },

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockLeads];
  }
};