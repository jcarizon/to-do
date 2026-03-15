"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadBoard, initBoard } from "@/features/board/store/boardSlice";
import { loadTickets } from "@/features/tickets/store/ticketsSlice";
import { useAuth } from "@/features/auth/hooks/useAuth";

const DEFAULT_BOARD_ID = "main";
const DEFAULT_BOARD_TITLE = "My Board";

export function useBoard() {
  const dispatch = useAppDispatch();
  const { user, authReady } = useAuth();
  const { board, columns, loading, error } = useAppSelector((s) => s.board);
  const { tickets } = useAppSelector((s) => s.tickets);

  useEffect(() => {
    if (!authReady || !user) return;

    dispatch(loadBoard({ uid: user.uid, boardId: DEFAULT_BOARD_ID })).then(
      (result) => {
        if (loadBoard.fulfilled.match(result) && !result.payload.board) {
          dispatch(
            initBoard({
              uid: user.uid,
              boardId: DEFAULT_BOARD_ID,
              title: DEFAULT_BOARD_TITLE,
            })
          );
        }
      }
    );

    dispatch(loadTickets({ uid: user.uid, boardId: DEFAULT_BOARD_ID }));
  }, [authReady, user, dispatch]);

  return {
    board,
    columns,
    tickets,
    loading,
    error,
    uid: user?.uid ?? "",
    boardId: DEFAULT_BOARD_ID,
  };
}