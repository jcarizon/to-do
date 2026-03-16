import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationsState, Toast } from '../types';

export const PUSH_ENABLED_KEY = 'techlint:pushEnabled';

export function readPushEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(PUSH_ENABLED_KEY);
  return stored === null ? true : stored === 'true';
}

const initialState: NotificationsState = {
  toasts: [],
  pushEnabled: true,
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
    setPushEnabled(state, action: PayloadAction<boolean>) {
      state.pushEnabled = action.payload;
    },
    togglePush(state) {
      state.pushEnabled = !state.pushEnabled;
    },
  },
});

export const { addToast, removeToast, clearToasts, setPushEnabled, togglePush } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;