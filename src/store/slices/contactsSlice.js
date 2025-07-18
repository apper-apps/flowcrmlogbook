import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contacts: [],
  loading: false,
  error: null,
  searchTerm: "",
  selectedTags: [],
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      // Reset loading state when error occurs
      if (action.payload) {
        state.loading = false;
      }
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
} = contactsSlice.actions;

export default contactsSlice.reducer;