import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBoardHistory, fetchTicketHistory } from '@/lib/firebase/firestore';
import { HistoryState } from '../types';

const initialState: HistoryState = {
  boardEvents: [],
  ticketEvents: {},
  loading: false,
};

export const loadBoardHistory = createAsyncThunk(
  'history/loadBoardHistory',
  async ({ uid, boardId }: { uid: string; boardId: string }) => {
    return await fetchBoardHistory({ uid, boardId });
  }
);

export const loadTicketHistory = createAsyncThunk(
  'history/loadTicketHistory',
  async ({ uid, boardId, ticketId }: { uid: string; boardId: string; ticketId: string }) => {
    const events = await fetchTicketHistory({ uid, boardId, ticketId });
    return { ticketId, events };
  }
);

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    appendBoardEvent(state, action) {
      state.boardEvents.unshift(action.payload);
    },
    appendTicketEvent(state, action) {
      const { ticketId } = action.payload;
      if (!state.ticketEvents[ticketId]) state.ticketEvents[ticketId] = [];
      state.ticketEvents[ticketId].unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBoardHistory.fulfilled, (state, action) => {
        state.boardEvents = [...action.payload].sort(
          (a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      })
      .addCase(loadTicketHistory.fulfilled, (state, action) => {
        const { ticketId, events } = action.payload;
        state.ticketEvents[ticketId] = [...events].sort(
          (a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });
  },
});

export const { appendBoardEvent, appendTicketEvent } = historySlice.actions;
export default historySlice.reducer;