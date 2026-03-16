import { DragEvent, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { BoardColumnProps } from "./types";
import { removeColumn, updateColumnTitle } from "@/features/board/store/boardSlice";
import { appendBoardEvent } from "@/features/history/store/historySlice";
import { useColumnDrag } from "@/features/board/hooks/useColumnDrag";
import { useDragContext } from "@/features/board/hooks/useDragContext";

export const useBoardColumn = ({
  column, tickets, uid, boardId, columnOrder,
  onColumnReorder, onTicketMove,
}: BoardColumnProps) => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const { dragging } = useDragContext();

  const liveTitle = useAppSelector((s) => s.board.columns[column.id]?.title ?? column.title);

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(column.title);
  const [isTicketDragOver, setIsTicketDragOver] = useState(false);

  const sorted = [...tickets].sort((a, b) => a.priorityOrder - b.priorityOrder);

  const { isDraggingThis, isDragOver: isColumnDragOver, columnDragHandlers } = useColumnDrag({
    columnId: column.id,
    onReorder: onColumnReorder,
  });

  const onColumnTicketDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (dragging?.type !== 'ticket') return;
    if ((dragging as { sourceColumnId: string }).sourceColumnId === column.id) return;
    event.dataTransfer.dropEffect = 'move';
    setIsTicketDragOver(true);
  }

  const onColumnTicketDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsTicketDragOver(false);
  }

  const onColumnTicketDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsTicketDragOver(false);
    if (event.dataTransfer.getData('type') !== 'ticket') return;
    const ticketId = event.dataTransfer.getData('ticketId');
    onTicketMove(ticketId, column.id);
  }
  
  const startRename = () => { 
    setRenameValue(column.title); 
    setIsRenaming(true); 
    setMenuOpen(false); 
    setTimeout(() => inputRef.current?.select(), 0); 
  };

  const commitRename = async () => { 
    const renamedTitle = renameValue.trim(); 
    setIsRenaming(false); 
    if (!renamedTitle || renamedTitle === column.title) return; 
    await dispatch(updateColumnTitle({ 
      uid, 
      boardId, 
      columnId: column.id, 
      title: renamedTitle
    })); 
  };

  const cancelRename = () => { 
    setRenameValue(column.title); 
    setIsRenaming(false); 
  };

  const handleDelete = async () => {
    await dispatch(removeColumn({ 
      uid, 
      boardId, 
      columnId: column.id, 
      columnOrder 
    }));

    dispatch(appendBoardEvent({ 
      id: crypto.randomUUID(), 
      type: 'COLUMN_DELETED', 
      description: `Column "${column.title}" was deleted.`, 
      timestamp: new Date().toISOString() 
    }));
  };

  const closeMenu = () => { 
    setMenuOpen(false); 
    setConfirmDelete(false); 
  };

  return {
    sorted, liveTitle, inputRef,
    menuOpen, setMenuOpen, confirmDelete, setConfirmDelete, closeMenu,
    isRenaming, renameValue, setRenameValue, startRename, commitRename, cancelRename,
    handleDelete,
    // DnD
    isDraggingThis, isColumnDragOver,
    columnDragHandlers,
    isTicketDragOver, onColumnTicketDragOver, onColumnTicketDragLeave, onColumnTicketDrop,
  };
};