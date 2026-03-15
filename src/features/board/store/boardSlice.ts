import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchBoard,
  fetchColumns,
  createBoard,
  createColumn,
  deleteColumn,
  updateColumnOrder,
} from "@/lib/firebase/firestore";
import { Board, BoardState, Column } from "../types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from '@/lib/firebase/firebase';

const initialState: BoardState = {
  board: null,
  columns: {},
  loading: false,
  error: null,
};

export const loadBoard = createAsyncThunk(
  "board/loadBoard",
  async ({ uid, boardId }: { uid: string; boardId: string }) => {
    const [rawBoard, rawColumns] = await Promise.all([
      fetchBoard({ uid, boardId }),
      fetchColumns({ uid, boardId }),
    ]);
    return {
      board: rawBoard as Board | null,
      columns: rawColumns as Column[],
    };
  }
);

export const initBoard = createAsyncThunk(
  "board/initBoard",
  async ({
    uid,
    boardId,
    title,
  }: {
    uid: string;
    boardId: string;
    title: string;
  }) => {
    await createBoard({ uid, boardId, title });
    const raw = await fetchBoard({ uid, boardId });
    return raw as Board;
  }
);

export const addColumn = createAsyncThunk(
  "board/addColumn",
  async ({
    uid,
    boardId,
    title,
    color,
    columnOrder,
  }: {
    uid: string;
    boardId: string;
    title: string;
    color: string;
    columnOrder: string[];
  }) => {
    const columnId = crypto.randomUUID();
    const order = columnOrder.length;
    const data: Omit<Column, "id"> = { boardId, title, color, order };
    await createColumn({ uid, boardId, columnId, data });
    const newOrder = [...columnOrder, columnId];
    await updateColumnOrder({ uid, boardId, columnOrder: newOrder });
    return { column: { id: columnId, ...data } as Column, newOrder };
  }
);

export const removeColumn = createAsyncThunk(
  "board/removeColumn",
  async ({
    uid,
    boardId,
    columnId,
    columnOrder,
  }: {
    uid: string;
    boardId: string;
    columnId: string;
    columnOrder: string[];
  }) => {
    await deleteColumn({ uid, boardId, columnId });
    const newOrder = columnOrder.filter((id) => id !== columnId);
    await updateColumnOrder({ uid, boardId, columnOrder: newOrder });
    return { columnId, newOrder };
  }
);

export const updateColumnTitle = createAsyncThunk(
  'board/updateColumnTitle',
  async ({
    uid, boardId, columnId, title,
  }: {
    uid: string; boardId: string; columnId: string; title: string;
  }) => {
    await updateDoc(
      doc(db, 'users', uid, 'boards', boardId, 'columns', columnId),
      { title },
    );
    return { columnId, title };
  },
);

export const reorderColumns = createAsyncThunk(
  "board/reorderColumns",
  async ({
    uid,
    boardId,
    columnOrder,
  }: {
    uid: string;
    boardId: string;
    columnOrder: string[];
  }) => {
    await updateColumnOrder({ uid, boardId, columnOrder });
    return columnOrder;
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoard(state, action) {
      state.board = action.payload;
    },
    setColumns(state, action) {
      state.columns = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    reorderColumnsOptimistic(state, action) {
      if (state.board) state.board.columnOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBoard.fulfilled, (state, action) => {
        state.board = action.payload.board;
        state.columns = Object.fromEntries(
          action.payload.columns.map((c) => [c.id, c])
        );
        state.loading = false;
      })
      .addCase(loadBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load board";
      })
      .addCase(initBoard.fulfilled, (state, action) => {
        state.board = action.payload;
      })
      .addCase(addColumn.fulfilled, (state, action) => {
        const { column, newOrder } = action.payload;
        state.columns[column.id] = column;
        if (state.board) state.board.columnOrder = newOrder;
      })
      .addCase(removeColumn.fulfilled, (state, action) => {
        const { columnId, newOrder } = action.payload;
        delete state.columns[columnId];
        if (state.board) state.board.columnOrder = newOrder;
      })
      .addCase(updateColumnTitle.fulfilled, (state, action) => {
        const { columnId, title } = action.payload;
        if (state.columns[columnId]) {
          state.columns[columnId].title = title;
        }
      })
      .addCase(reorderColumns.fulfilled, (state, action) => {
        if (state.board) state.board.columnOrder = action.payload;
      });
  },
});

export const {
  setBoard,
  setColumns,
  setLoading,
  clearError,
  reorderColumnsOptimistic,
} = boardSlice.actions;
export default boardSlice.reducer;