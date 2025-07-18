import mockMessages from "@/services/mockData/messages.json";

export const inboxService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockMessages];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockMessages.find(message => message.Id === id);
  },

  async create(messageData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newMessage = {
      ...messageData,
      Id: Math.max(...mockMessages.map(m => m.Id)) + 1,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    mockMessages.push(newMessage);
    return newMessage;
  },

  async update(id, messageData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockMessages.findIndex(message => message.Id === id);
    if (index !== -1) {
      mockMessages[index] = { ...mockMessages[index], ...messageData };
      return mockMessages[index];
    }
    throw new Error("Message not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockMessages.findIndex(message => message.Id === id);
    if (index !== -1) {
      mockMessages.splice(index, 1);
      return true;
    }
    throw new Error("Message not found");
  },

  async markAsRead(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = mockMessages.findIndex(message => message.Id === id);
    if (index !== -1) {
      mockMessages[index].isRead = true;
      return mockMessages[index];
    }
    throw new Error("Message not found");
  }
};