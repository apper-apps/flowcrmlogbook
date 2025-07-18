import { configureStore } from "@reduxjs/toolkit";
import pipelineReducer from "@/store/slices/pipelineSlice";
import contactsReducer from "@/store/slices/contactsSlice";
import inboxReducer from "@/store/slices/inboxSlice";
import documentsReducer from "@/store/slices/documentsSlice";
import billingReducer from "@/store/slices/billingSlice";
import uiReducer from "@/store/slices/uiSlice";

export const store = configureStore({
  reducer: {
    pipeline: pipelineReducer,
    contacts: contactsReducer,
    inbox: inboxReducer,
    documents: documentsReducer,
    billing: billingReducer,
    ui: uiReducer,
  },
});