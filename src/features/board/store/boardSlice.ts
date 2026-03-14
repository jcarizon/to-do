import { fetchBoard, fetchColumns } from "@/lib/firebase/firestore";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BoardState } from "../types";

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
      fetchBoard({ uid, boardId }),
      fetchColumns({ uid, boardId }),
    ]);
    return { board, columns };
  }
);

const boardSlice = createSlice({
  name: 'board',
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBoard.fulfilled, (state, action) => {
        state.board = action.payload.board;
        state.columns = action.payload.columns;
        state.loading = false;
      })
      .addCase(loadBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }); 
  },
});

export const { setBoard, setColumns, setLoading, clearError } = boardSlice.actions;
export default boardSlice.reducer;
