import mockContacts from "@/services/mockData/contacts.json";
// Enhanced timeout wrapper with retry mechanism
const withTimeoutAndRetry = async (asyncFn, maxRetries = 3, baseDelay = 1000, timeoutMs = 5000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const promise = asyncFn();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
      );
      
      return await Promise.race([promise, timeoutPromise]);
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

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
      return await withTimeoutAndRetry(
        () => new Promise(resolve => setTimeout(() => resolve([...mockContacts]), 300)),
        3,
        1000,
        5000
      );
    } catch (error) {
      if (error.message === 'Request timeout') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      throw new Error('Failed to load contacts. Please try again.');
    }
  },

  async getById(id) {
    try {
      return await withTimeoutAndRetry(
        () => new Promise(resolve => setTimeout(() => resolve(mockContacts.find(contact => contact.Id === id)), 200)),
        3,
        500,
        3000
      );
    } catch (error) {
      if (error.message === 'Request timeout') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      throw new Error('Failed to load contact. Please try again.');
    }
  },

  async create(contactData) {
    try {
      return await withTimeoutAndRetry(
        () => new Promise(resolve => {
          setTimeout(() => {
            const newContact = {
              ...contactData,
              Id: Math.max(...mockContacts.map(c => c.Id)) + 1,
              lastActivity: new Date().toISOString()
            };
            mockContacts.push(newContact);
            resolve(newContact);
          }, 400);
        }),
        3,
        1000,
        5000
      );
    } catch (error) {
      if (error.message === 'Request timeout') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      throw new Error('Failed to create contact. Please try again.');
    }
  },

  async update(id, contactData) {
    try {
      return await withTimeoutAndRetry(
        () => new Promise((resolve, reject) => {
          setTimeout(() => {
            const index = mockContacts.findIndex(contact => contact.Id === id);
            if (index !== -1) {
              mockContacts[index] = { ...mockContacts[index], ...contactData };
              resolve(mockContacts[index]);
            } else {
              reject(new Error("Contact not found"));
            }
          }, 300);
        }),
        3,
        1000,
        5000
      );
    } catch (error) {
      if (error.message === 'Request timeout') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      throw new Error('Failed to update contact. Please try again.');
    }
  },

  async delete(id) {
    try {
      return await withTimeoutAndRetry(
        () => new Promise((resolve, reject) => {
          setTimeout(() => {
            const index = mockContacts.findIndex(contact => contact.Id === id);
            if (index !== -1) {
              mockContacts.splice(index, 1);
              resolve(true);
            } else {
              reject(new Error("Contact not found"));
            }
          }, 300);
        }),
        3,
        1000,
        5000
      );
    } catch (error) {
      if (error.message === 'Request timeout') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      throw new Error('Failed to delete contact. Please try again.');
throw new Error('Failed to delete contact. Please try again.');
    }
  }