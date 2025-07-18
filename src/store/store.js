import { configureStore } from '@reduxjs/toolkit';
import uiSlice from './slices/uiSlice';
import contactsSlice from './slices/contactsSlice';
import pipelineSlice from './slices/pipelineSlice';
import inboxSlice from './slices/inboxSlice';
import documentsSlice from './slices/documentsSlice';
import billingSlice from './slices/billingSlice';
import userSlice from './slices/userSlice';

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    contacts: contactsSlice,
    pipeline: pipelineSlice,
    inbox: inboxSlice,
    documents: documentsSlice,
    billing: billingSlice,
    user: userSlice,
  },
});

export default store;