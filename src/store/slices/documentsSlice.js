import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  documents: [],
  templates: [],
  loading: false,
  error: null,
  selectedTemplate: null,
};

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setDocuments: (state, action) => {
      state.documents = action.payload;
    },
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload;
    },
addDocument: (state, action) => {
      state.documents.push(action.payload);
    },
    updateDocument: (state, action) => {
      const index = state.documents.findIndex(doc => doc.id === action.payload.id);
      if (index !== -1) {
        state.documents[index] = { ...state.documents[index], ...action.payload };
      }
    },
    deleteDocument: (state, action) => {
      state.documents = state.documents.filter(document => document.id !== action.payload);
    },
  },
});

export const {
  setDocuments,
  setLoading,
  setError,
  setTemplates,
  setSelectedTemplate,
  addDocument,
  updateDocument,
  deleteDocument,
} = documentsSlice.actions;

export default documentsSlice.reducer;