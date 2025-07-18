import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pipelines: [],
  leads: [],
  activePipeline: null,
  loading: false,
  error: null,
};

const pipelineSlice = createSlice({
  name: "pipeline",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPipelines: (state, action) => {
      state.pipelines = action.payload;
    },
    setLeads: (state, action) => {
      state.leads = action.payload;
    },
    setActivePipeline: (state, action) => {
      state.activePipeline = action.payload;
    },
    updateLead: (state, action) => {
      const index = state.leads.findIndex(lead => lead.Id === action.payload.Id);
      if (index !== -1) {
        state.leads[index] = action.payload;
      }
    },
    addLead: (state, action) => {
      state.leads.push(action.payload);
    },
    deleteLead: (state, action) => {
      state.leads = state.leads.filter(lead => lead.Id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setPipelines,
  setLeads,
  setActivePipeline,
  updateLead,
  addLead,
  deleteLead,
} = pipelineSlice.actions;

export default pipelineSlice.reducer;