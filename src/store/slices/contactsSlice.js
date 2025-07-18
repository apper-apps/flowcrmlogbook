import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contacts: [],
  loading: false,
  error: null,
searchTerm: "",
  selectedTags: [],
  groupBy: null,
};

const contactsSlice = createSlice({
  name: "contacts",
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
    setContacts: (state, action) => {
      state.contacts = action.payload;
      // Reset error and loading state on successful data load
      state.error = null;
      state.loading = false;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedTags: (state, action) => {
      state.selectedTags = action.payload;
    },
    addContact: (state, action) => {
      state.contacts.push(action.payload);
    },
    updateContact: (state, action) => {
      const index = state.contacts.findIndex(contact => contact.Id === action.payload.Id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
      }
    },
    deleteContact: (state, action) => {
      state.contacts = state.contacts.filter(contact => contact.Id !== action.payload);
    },
    resetContactsState: (state) => {
      state.loading = false;
      state.error = null;
state.searchTerm = "";
      state.selectedTags = [];
      state.groupBy = null;
    },
    setGroupBy: (state, action) => {
      state.groupBy = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setContacts,
  setSearchTerm,
  setSelectedTags,
  addContact,
  updateContact,
deleteContact,
  resetContactsState,
  setGroupBy,
} = contactsSlice.actions;

export default contactsSlice.reducer;