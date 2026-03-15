import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { BoardColumnProps } from "./types";
import { useRef, useState } from "react";
import { removeColumn, updateColumnTitle } from "@/features/board/store/boardSlice";
import { appendBoardEvent } from "@/features/history/store/historySlice";

export const useBoardColumn = ({
  column,
  tickets,
  uid,
  boardId,
  columnOrder,
}: BoardColumnProps) => {
    const dispatch = useAppDispatch();
    const inputRef = useRef<HTMLInputElement>(null);

    const liveTitle = useAppSelector(
      (s) => s.board.columns[column.id]?.title ?? column.title,
    );

    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState(column.title);
  
    const sorted = [...tickets].sort((a, b) => a.priorityOrder - b.priorityOrder);

    const startRename = () => {
      setRenameValue(column.title);
      setIsRenaming(true);
      setMenuOpen(false);
      setTimeout(() => inputRef.current?.select(), 0);
    };
  
    const commitRename = async () => {
      const trimmed = renameValue.trim();
      setIsRenaming(false);
      if (!trimmed || trimmed === column.title) return;
      await dispatch(updateColumnTitle({ uid, boardId, columnId: column.id, title: trimmed }));
    };
  
    const cancelRename = () => {
      setRenameValue(column.title);
      setIsRenaming(false);
    };
  
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
      isRenaming,
      startRename,
      commitRename,
      cancelRename,
      renameValue,
      setRenameValue,
      inputRef,
      liveTitle
    };
  };