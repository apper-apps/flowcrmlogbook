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
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
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
    markAsRead: (state, action) => {
      const message = state.messages.find(msg => msg.Id === action.payload);
      if (message) {
        message.isRead = true;
      }
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
  markAsRead,
} = inboxSlice.actions;

export default inboxSlice.reducer;