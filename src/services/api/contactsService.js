import mockContacts from "@/services/mockData/contacts.json";

export const contactsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockContacts];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockContacts.find(contact => contact.Id === id);
  },

  async create(contactData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newContact = {
      ...contactData,
      Id: Math.max(...mockContacts.map(c => c.Id)) + 1,
      lastActivity: new Date().toISOString()
    };
    mockContacts.push(newContact);
    return newContact;
  },

  async update(id, contactData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockContacts.findIndex(contact => contact.Id === id);
    if (index !== -1) {
      mockContacts[index] = { ...mockContacts[index], ...contactData };
      return mockContacts[index];
    }
    throw new Error("Contact not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockContacts.findIndex(contact => contact.Id === id);
    if (index !== -1) {
      mockContacts.splice(index, 1);
      return true;
    }
    throw new Error("Contact not found");
  }
};