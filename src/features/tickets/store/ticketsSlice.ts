import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  createTicket,
  updateTicket,
  deleteTicket,
  fetchTickets,
} from '@/lib/firebase/firestore';
import type { Ticket, TicketsState } from '../types';

const initialState: TicketsState = {
  tickets: {},
  loading: false,
  error: null,
};

interface AddTicketArg {
  uid: string;
  boardId: string;
  ticket: Omit<Ticket, 'id'>;
}

interface EditTicketArg {
  uid: string;
  boardId: string;
  ticketId: string;
  changes: Partial<Ticket> | object;
}

interface RemoveTicketArg {
  uid: string;
  boardId: string;
  ticketId: string;
}

interface SaveDraftArg {
  uid: string;
  boardId: string;
  ticketId: string;
  draft: string;
}

export const loadTickets = createAsyncThunk<
  Ticket[],
  { uid: string; boardId: string }
>(
  'tickets/loadTickets',
  async ({ uid, boardId }) => {
    return await fetchTickets({ uid, boardId });
  },
);

export const addTicket = createAsyncThunk(
  'tickets/addTicket',
  async ({ uid, boardId, ticket }: AddTicketArg) => {
    const ticketId = crypto.randomUUID();
    await createTicket({ uid, boardId, ticketId, data: ticket });
    return { id: ticketId, ...ticket } as Ticket;
  },
);

export const editTicket = createAsyncThunk(
  'tickets/editTicket',
  async ({ uid, boardId, ticketId, changes }: EditTicketArg) => {
    await updateTicket({ uid, boardId, ticketId, data: changes });
    return { ticketId, changes };
  },
);

export const removeTicket = createAsyncThunk(
  'tickets/removeTicket',
  async ({ uid, boardId, ticketId }: RemoveTicketArg) => {
    await deleteTicket({ uid, boardId, ticketId });
    return ticketId;
  },
);

export const saveDraft = createAsyncThunk(
  'tickets/saveDraft',
  async ({ uid, boardId, ticketId, draft }: SaveDraftArg) => {
    await updateTicket({
      uid,
      boardId,
      ticketId,
      data: { descriptionDraft: draft },
    });
    return { ticketId, draft };
  },
);

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    moveTicketOptimistic(
      state,
      action: PayloadAction<{ ticketId: string; columnId: string }>,
    ) {
      const ticket = state.tickets[action.payload.ticketId];
      if (ticket) ticket.columnId = action.payload.columnId;
    },
    reorderTicketPriorityOptimistic(
      state,
      action: PayloadAction<{ ticketId: string; priorityOrder: number }>,
    ) {
      const ticket = state.tickets[action.payload.ticketId];
      if (ticket) ticket.priorityOrder = action.payload.priorityOrder;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = Object.fromEntries(
          action.payload.map((t) => [t.id, t]),
        );
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
        if (state.tickets[ticketId]) {
          state.tickets[ticketId].descriptionDraft = draft;
        }
      });
  },
});

export const { moveTicketOptimistic, reorderTicketPriorityOptimistic } =
  ticketsSlice.actions;
export default ticketsSlice.reducer;