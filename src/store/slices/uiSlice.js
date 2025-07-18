import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: "en",
  sidebarOpen: false,
  darkMode: true,
  notifications: [],
  listView: {
    rowSize: "medium", // large, medium, small
    sectionFilters: {
      inbox: [],
      contacts: [],
      pipeline: [],
      documents: [],
      billing: []
    }
  }
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
setRowSize: (state, action) => {
      state.listView.rowSize = action.payload;
    },
    setSectionFilters: (state, action) => {
      const { section, filters } = action.payload;
      state.listView.sectionFilters[section] = filters;
    },
  },
});

export const {
  setLanguage,
  setSidebarOpen,
  toggleSidebar,
  setDarkMode,
  addNotification,
  removeNotification,
  setRowSize,
  setSectionFilters,
} = uiSlice.actions;

export default uiSlice.reducer;