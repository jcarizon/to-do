import { useAppDispatch } from "@/store/hooks";
import { BoardColumnProps } from "./types";
import { useState } from "react";
import { removeColumn } from "@/features/board/store/boardSlice";
import { appendBoardEvent } from "@/features/history/store/historySlice";

export const useBoardColumn = ({
  column,
  tickets,
  priorities,
  uid,
  boardId,
  columnOrder,
  onOpenTicket,
  onAddTicket,
}: BoardColumnProps) => {
  
    const dispatch = useAppDispatch();
    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
  
    const sorted = [...tickets].sort((a, b) => a.priorityOrder - b.priorityOrder);
  
    const handleDelete = async () => {
      await dispatch(removeColumn({ uid, boardId, columnId: column.id, columnOrder }));
      dispatch(
        appendBoardEvent({
          id: crypto.randomUUID(),
          type: 'COLUMN_DELETED',
          description: `Column "${column.title}" was deleted.`,
          timestamp: new Date().toISOString(),
        }),
      );
    };
  
    const closeMenu = () => {
      setMenuOpen(false);
      setConfirmDelete(false);
    };

    return {
      sorted,
      handleDelete,
      closeMenu,
      menuOpen,
      confirmDelete,
      setConfirmDelete,
      setMenuOpen,
    };
  };