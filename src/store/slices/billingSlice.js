import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: [],
  loading: false,
  error: null,
  selectedInvoice: null,
};
const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setInvoices: (state, action) => {
      state.invoices = action.payload;
    },
    setSelectedInvoice: (state, action) => {
      state.selectedInvoice = action.payload;
    },
    addInvoice: (state, action) => {
      state.invoices.push(action.payload);
    },
updateInvoice: (state, action) => {
      const index = state.invoices.findIndex(invoice => invoice.Id === action.payload.Id);
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
    },
    deleteInvoice: (state, action) => {
      state.invoices = state.invoices.filter(invoice => invoice.Id !== action.payload);
    },
    addInvoice: (state, action) => {
      state.invoices.push(action.payload);
    },
  },
});

export const {
  setInvoices,
  setLoading,
  setError,
  setSelectedInvoice,
  updateInvoice,
  deleteInvoice,
  addInvoice,
} = billingSlice.actions;

export default billingSlice.reducer;