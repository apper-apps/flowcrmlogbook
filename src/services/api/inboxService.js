import mockMessages from "@/services/mockData/messages.json";

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

export const inboxService = {
  async getAll() {
    try {
      return await withTimeoutAndRetry(
        () => new Promise(resolve => setTimeout(() => resolve([...mockMessages]), 300)),
        3,
        1000,
        5000
      );
    } catch (error) {
      if (error.message === 'Request timeout') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      throw new Error('Failed to load messages. Please try again.');
    }
  },

  async getById(id) {
    try {
      return await withTimeoutAndRetry(
        () => new Promise(resolve => setTimeout(() => resolve(mockMessages.find(message => message.Id === id)), 200)),
        3,
        500,
        3000
      );
    } catch (error) {
      if (error.message === 'Request timeout') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      throw new Error('Failed to load message. Please try again.');
    }
  },

  async create(messageData) {
    try {
      return await withTimeoutAndRetry(
        () => new Promise(resolve => {
          setTimeout(() => {
            const newMessage = {
              ...messageData,
              Id: Math.max(...mockMessages.map(m => m.Id)) + 1,
              timestamp: new Date().toISOString(),
              isRead: false
            };
            mockMessages.push(newMessage);
            resolve(newMessage);
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
      throw new Error('Failed to send message. Please try again.');
    }
  },

  async update(id, messageData) {
    try {
      return await withTimeoutAndRetry(
        () => new Promise((resolve, reject) => {
          setTimeout(() => {
            const index = mockMessages.findIndex(message => message.Id === id);
            if (index !== -1) {
              mockMessages[index] = { ...mockMessages[index], ...messageData };
              resolve(mockMessages[index]);
            } else {
              reject(new Error("Message not found"));
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
      throw new Error('Failed to update message. Please try again.');
    }
  },

  async delete(id) {
    try {
      return await withTimeoutAndRetry(
        () => new Promise((resolve, reject) => {
          setTimeout(() => {
            const index = mockMessages.findIndex(message => message.Id === id);
            if (index !== -1) {
              mockMessages.splice(index, 1);
              resolve(true);
            } else {
              reject(new Error("Message not found"));
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
      throw new Error('Failed to delete message. Please try again.');
    }
  },

  async markAsRead(id) {
    try {
      return await withTimeoutAndRetry(
        () => new Promise((resolve, reject) => {
          setTimeout(() => {
            const index = mockMessages.findIndex(message => message.Id === id);
            if (index !== -1) {
              mockMessages[index].isRead = true;
              resolve(mockMessages[index]);
            } else {
              reject(new Error("Message not found"));
            }
          }, 200);
        }),
        3,
        500,
        3000
      );
    } catch (error) {
      if (error.message === 'Request timeout') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      throw new Error('Failed to mark message as read. Please try again.');
    }
  }
};