import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  threads: [],
  activeThread: null,
  loading: false,
  error: null,
};

const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
      // Clear error when starting new loading operation
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      // Always reset loading state when error occurs
      state.loading = false;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
      // Reset error and loading state on successful data load
      state.error = null;
      state.loading = false;
    },
    setThreads: (state, action) => {
      state.threads = action.payload;
    },
    setActiveThread: (state, action) => {
      state.activeThread = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action) => {
      const index = state.messages.findIndex(msg => msg.id === action.payload.id);
      if (index !== -1) {
        state.messages[index] = { ...state.messages[index], ...action.payload };
      }
    },
    deleteMessage: (state, action) => {
      state.messages = state.messages.filter(message => message.id !== action.payload);
    },
    markAsRead: (state, action) => {
      const message = state.messages.find(msg => msg.id === action.payload);
      if (message) {
        message.isRead = true;
      }
    },
    resetInboxState: (state) => {
      state.messages = [];
      state.threads = [];
      state.activeThread = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setMessages,
  setThreads,
  setActiveThread,
  addMessage,
  updateMessage,
  deleteMessage,
  markAsRead,
  resetInboxState,
} = inboxSlice.actions;

export default inboxSlice.reducer;