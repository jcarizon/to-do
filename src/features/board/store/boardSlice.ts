import { createColumn, deleteColumn, fetchBoard, fetchColumns, updateColumnOrder } from "@/lib/firebase/firestore";
import { createAsyncThunk, createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { Board, BoardState, Column } from "../types";

const initialState: BoardState = {
  board: null,
  columns: {},
  loading: false,
  error: null,
};

export const loadBoard = createAsyncThunk(
  'board/loadBoard',
  async ({ uid, boardId }: { uid: string; boardId: string }) => {
    const [board, columns] = await Promise.all([
      fetchBoard(uid, boardId),
      fetchColumns(uid, boardId),
    ]);
    return { board, columns };
  }
);

export const addColumn = createAsyncThunk(
  'board/addColumn',
  async ({ uid, boardId, title, color }: { uid: string; boardId: string; title: string; color: string }, { getState }) => {
    const columnId = nanoid();
    const state = (getState() as any).board;
    const order = Object.keys(state.columns).length;
    const column: Column = { id: columnId, boardId, title, color, order };
    await createColumn(uid, boardId, columnId, column);
    const newOrder = [...(state.board?.columnOrder ?? []), columnId];
    await updateColumnOrder(uid, boardId, newOrder);
    return { column, newOrder };
  }
);

export const removeColumn = createAsyncThunk(
  'board/removeColumn',
  async ({ uid, boardId, columnId }: { uid: string; boardId: string; columnId: string }, { getState }) => {
    await deleteColumn(uid, boardId, columnId);
    const state = (getState() as any).board;
    const newOrder = (state.board?.columnOrder ?? []).filter((id: string) => id !== columnId);
    await updateColumnOrder(uid, boardId, newOrder);
    return { columnId, newOrder };
  }
);

export const reorderColumns = createAsyncThunk(
  'board/reorderColumns',
  async ({ uid, boardId, columnOrder }: { uid: string; boardId: string; columnOrder: string[] }) => {
    await updateColumnOrder(uid, boardId, columnOrder);
    return columnOrder;
  }
);

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setColumnOrder(state, action: PayloadAction<string[]>) {
      if (state.board) state.board.columnOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBoard.pending, (state) => { state.loading = true; })
      .addCase(loadBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.board = action.payload.board as Board;
        state.columns = Object.fromEntries(
          action.payload.columns.map((c: any) => [c.id, c])
        );
      })
      .addCase(loadBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load board';
      })
      .addCase(addColumn.fulfilled, (state, action) => {
        const { column, newOrder } = action.payload;
        state.columns[column.id] = column;
        if (state.board) state.board.columnOrder = newOrder;
      })
      .addCase(removeColumn.fulfilled, (state, action) => {
        delete state.columns[action.payload.columnId];
        if (state.board) state.board.columnOrder = action.payload.newOrder;
      })
      .addCase(reorderColumns.fulfilled, (state, action) => {
        if (state.board) state.board.columnOrder = action.payload;
      });
  },
});

export const { setColumnOrder } = boardSlice.actions;
export default boardSlice.reducer;
