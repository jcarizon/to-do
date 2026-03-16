import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationsState, Toast } from '../types';
 
const initialState: NotificationsState = {
  toasts: [],
};
 
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addToast(state, action: PayloadAction<Toast>) {
      state.toasts.push(action.payload);
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts(state) {
      state.toasts = [];
    },
  },
});
 
export const { addToast, removeToast, clearToasts } = notificationsSlice.actions;
export default notificationsSlice.reducer;

