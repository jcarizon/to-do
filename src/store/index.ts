import { configureStore } from '@reduxjs/toolkit';
import authReducer from "@/features/auth/store/authSlice";
import boardReducer from '@/features/board/store/boardSlice';
import ticketsReducer from '@/features/tickets/store/ticketsSlice';
import historyReducer from '@/features/history/store/historySlice';
import notificationsReducer from '@/features/notifications/store/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    board: boardReducer,
    tickets: ticketsReducer,
    history: historyReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;