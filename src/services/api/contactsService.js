import mockContacts from "@/services/mockData/contacts.json";

// Timeout wrapper to prevent infinite loading
const withTimeout = (promise, timeoutMs = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
};

export const contactsService = {
  async getAll() {
    try {
      await withTimeout(new Promise(resolve => setTimeout(resolve, 300)));
      return [...mockContacts];
    } catch (error) {
      if (error.message === 'Request timeout') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      throw error;
    }
  },

async getById(id) {
    try {
      await withTimeout(new Promise(resolve => setTimeout(resolve, 200)));
      return mockContacts.find(contact => contact.Id === id);
    } catch (error) {
      if (error.message === 'Request timeout') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      throw error;
    }
  },

async create(contactData) {
    try {
      await withTimeout(new Promise(resolve => setTimeout(resolve, 400)));
      const newContact = {
        ...contactData,
        Id: Math.max(...mockContacts.map(c => c.Id)) + 1,
        lastActivity: new Date().toISOString()
      };
      mockContacts.push(newContact);
      return newContact;
    } catch (error) {
      if (error.message === 'Request timeout') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      throw error;
    }
  },

async update(id, contactData) {
    try {
      await withTimeout(new Promise(resolve => setTimeout(resolve, 300)));
      const index = mockContacts.findIndex(contact => contact.Id === id);
      if (index !== -1) {
        mockContacts[index] = { ...mockContacts[index], ...contactData };
        return mockContacts[index];
      }
      throw new Error("Contact not found");
    } catch (error) {
      if (error.message === 'Request timeout') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      throw error;
    }
  },

async delete(id) {
    try {
      await withTimeout(new Promise(resolve => setTimeout(resolve, 300)));
      const index = mockContacts.findIndex(contact => contact.Id === id);
      if (index !== -1) {
        mockContacts.splice(index, 1);
        return true;
      }
      throw new Error("Contact not found");
    } catch (error) {
      if (error.message === 'Request timeout') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      throw error;
    }
  }
};