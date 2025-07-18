import mockMessages from "@/services/mockData/messages.json";

// Timeout wrapper to prevent infinite loading
const withTimeout = (promise, timeoutMs = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
};

export const inboxService = {
  async getAll() {
    try {
      await withTimeout(new Promise(resolve => setTimeout(resolve, 300)));
      return [...mockMessages];
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
      return mockMessages.find(message => message.Id === id);
    } catch (error) {
      if (error.message === 'Request timeout') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      throw error;
    }
  },

async create(messageData) {
    try {
      await withTimeout(new Promise(resolve => setTimeout(resolve, 400)));
      const newMessage = {
        ...messageData,
        Id: Math.max(...mockMessages.map(m => m.Id)) + 1,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      mockMessages.push(newMessage);
      return newMessage;
    } catch (error) {
      if (error.message === 'Request timeout') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      throw error;
    }
  },

async update(id, messageData) {
    try {
      await withTimeout(new Promise(resolve => setTimeout(resolve, 300)));
      const index = mockMessages.findIndex(message => message.Id === id);
      if (index !== -1) {
        mockMessages[index] = { ...mockMessages[index], ...messageData };
        return mockMessages[index];
      }
      throw new Error("Message not found");
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
      const index = mockMessages.findIndex(message => message.Id === id);
      if (index !== -1) {
        mockMessages.splice(index, 1);
        return true;
      }
      throw new Error("Message not found");
    } catch (error) {
      if (error.message === 'Request timeout') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      throw error;
    }
  },

async markAsRead(id) {
    try {
      await withTimeout(new Promise(resolve => setTimeout(resolve, 200)));
      const index = mockMessages.findIndex(message => message.Id === id);
      if (index !== -1) {
        mockMessages[index].isRead = true;
        return mockMessages[index];
      }
      throw new Error("Message not found");
    } catch (error) {
      if (error.message === 'Request timeout') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      throw error;
    }
  }
};