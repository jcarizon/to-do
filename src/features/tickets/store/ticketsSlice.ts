import { createTicket, deleteTicket, fetchTickets, updateTicket } from "@/lib/firebase/firestore";
import { createAsyncThunk, createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { Ticket, TicketsState } from '../types';

const initialState: TicketsState = {
  tickets: {},
  loading: false,
  error: null,
};

export const loadTickets = createAsyncThunk(
  'tickets/loadTickets',
  async ({ uid, boardId }: { uid: string; boardId: string }) => {
    return await fetchTickets({ uid, boardId });
  }
);

export const addTicket = createAsyncThunk(
  'tickets/addTicket',
  async ({ uid, boardId, data }: { uid: string; boardId: string; data: Omit<Ticket, 'id'> }) => {
    const ticketId = nanoid();
    const ticket: Ticket = { ...data, id: ticketId };
    await createTicket({ uid, boardId, ticketId, data: ticket });
    return ticket;
  }
);

export const editTicket = createAsyncThunk(
  'tickets/editTicket',
  async ({ uid, boardId, ticketId, changes }: {
    uid: string; boardId: string; ticketId: string; changes: Partial<Ticket>
  }) => {
    await updateTicket({ uid, boardId, ticketId, data: changes });
    return { ticketId, changes };
  }
);

export const removeTicket = createAsyncThunk(
  'tickets/removeTicket',
  async ({ uid, boardId, ticketId }: { uid: string; boardId: string; ticketId: string }) => {
    await deleteTicket({ uid, boardId, ticketId });
    return ticketId;
  }
);

export const saveDraft = createAsyncThunk(
  'tickets/saveDraft',
  async ({ uid, boardId, ticketId, draft }: { uid: string; boardId: string; ticketId: string; draft: string }) => {
    await updateTicket({ uid, boardId, ticketId, data: { descriptionDraft: draft } });
    return { ticketId, draft };
  }
);

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    moveTicket(state, action: PayloadAction<{ ticketId: string; columnId: string }>) {
      const ticket = state.tickets[action.payload.ticketId];
      if (ticket) ticket.columnId = action.payload.columnId;
    },
    reorderTicketPriority(state, action: PayloadAction<{ ticketId: string; priorityOrder: number }>) {
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

export const { moveTicket, reorderTicketPriority } = ticketsSlice.actions;
export default ticketsSlice.reducer;