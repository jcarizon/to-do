import { fetchBoard, fetchColumns, fetchTickets } from "@/lib/firebase/firestore";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ticket, TicketsState } from '../types';

const initialState: TicketsState = {
  tickets: {},
  loading: false,
  error: null,
};

export const loadTickets = createAsyncThunk(
  'tickets/loadTickets',
  async ({ uid, boardId }: { uid: string; boardId: string }) => {
    return await fetchTickets(uid, boardId);
  }
);

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    // Optimistic move — instant update before Firestore write
    moveTicketOptimistic(state, action: PayloadAction<{ ticketId: string; columnId: string }>) {
      const ticket = state.tickets[action.payload.ticketId];
      if (ticket) ticket.columnId = action.payload.columnId;
    },
    reorderTicketPriorityOptimistic(state, action: PayloadAction<{ ticketId: string; priorityOrder: number }>) {
      const ticket = state.tickets[action.payload.ticketId];
      if (ticket) ticket.priorityOrder = action.payload.priorityOrder;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTickets.pending, (state) => { state.loading = true; })
      .addCase(loadTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = Object.fromEntries(action.payload.map((t: any) => [t.id, t]));
      })
      .addCase(loadTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load tickets';
      })
      .addCase(addTicket.fulfilled, (state, action) => {
        state.tickets[action.payload.id] = action.payload;
      })
      .addCase(editTicket.fulfilled, (state, action) => {
        const { ticketId, changes } = action.payload;
        if (state.tickets[ticketId]) {
          state.tickets[ticketId] = { ...state.tickets[ticketId], ...changes };
        }
      })
      .addCase(removeTicket.fulfilled, (state, action) => {
        delete state.tickets[action.payload];
      })
      .addCase(saveDraft.fulfilled, (state, action) => {
        const { ticketId, draft } = action.payload;
        if (state.tickets[ticketId]) state.tickets[ticketId].descriptionDraft = draft;
      });
  },
});

export const { moveTicketOptimistic, reorderTicketPriorityOptimistic } = ticketsSlice.actions;
export default ticketsSlice.reducer;
