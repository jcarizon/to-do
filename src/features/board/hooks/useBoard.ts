"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadBoard, initBoard } from "@/features/board/store/boardSlice";
import { loadTickets } from "@/features/tickets/store/ticketsSlice";
import { loadBoardHistory, loadTicketHistory } from "@/features/history/store/historySlice";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function useBoard() {
  const dispatch = useAppDispatch();
  const { user, authReady } = useAuth();
  const { board, columns, loading, error } = useAppSelector((s) => s.board);
  const { tickets } = useAppSelector((s) => s.tickets);

  const DEFAULT_BOARD_ID = "main";
  const DEFAULT_BOARD_TITLE = "My Board";

  useEffect(() => {
    if (!authReady || !user) return;

    const uid = user.uid;
    const boardId = DEFAULT_BOARD_ID;

    dispatch(loadBoard({ uid, boardId })).then((result) => {
      if (loadBoard.fulfilled.match(result) && !result.payload.board) {
        dispatch(initBoard({ uid, boardId, title: DEFAULT_BOARD_TITLE }));
      }
    });

    dispatch(loadTickets({ uid, boardId })).then((result) => {
      if (loadTickets.fulfilled.match(result)) {
        result.payload.forEach((ticket) => {
          dispatch(loadTicketHistory({ uid, boardId, ticketId: ticket.id }));
        });
      }
    });

    dispatch(loadBoardHistory({ uid, boardId }));
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