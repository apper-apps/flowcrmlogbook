import mockInvoices from "@/services/mockData/invoices.json";

export const billingService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockInvoices];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockInvoices.find(invoice => invoice.Id === id);
  },

  async create(invoiceData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newInvoice = {
      ...invoiceData,
      Id: Math.max(...mockInvoices.map(i => i.Id)) + 1,
      number: `INV-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "draft"
    };
    mockInvoices.push(newInvoice);
    return newInvoice;
  },

  async update(id, invoiceData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockInvoices.findIndex(invoice => invoice.Id === id);
    if (index !== -1) {
      mockInvoices[index] = { ...mockInvoices[index], ...invoiceData };
      return mockInvoices[index];
    }
    throw new Error("Invoice not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockInvoices.findIndex(invoice => invoice.Id === id);
    if (index !== -1) {
      mockInvoices.splice(index, 1);
      return true;
    }
    throw new Error("Invoice not found");
  }
};