import mockDocuments from "@/services/mockData/documents.json";

export const documentsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockDocuments];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockDocuments.find(document => document.Id === id);
  },

  async create(documentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newDocument = {
      ...documentData,
      Id: Math.max(...mockDocuments.map(d => d.Id)) + 1,
      createdAt: new Date().toISOString(),
      status: "draft"
    };
    mockDocuments.push(newDocument);
    return newDocument;
  },

  async update(id, documentData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockDocuments.findIndex(document => document.Id === id);
    if (index !== -1) {
      mockDocuments[index] = { ...mockDocuments[index], ...documentData };
      return mockDocuments[index];
    }
    throw new Error("Document not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockDocuments.findIndex(document => document.Id === id);
    if (index !== -1) {
      mockDocuments.splice(index, 1);
      return true;
    }
    throw new Error("Document not found");
  }
};