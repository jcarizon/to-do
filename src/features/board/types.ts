import { Priority } from "../tickets/types";

export interface Column {
  id: string;
  boardId: string;
  title: string;
  color: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Board {
  id: string;
  uid: string;
  title: string;
  columnOrder: string[];
  priorities?: Priority[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BoardState {
  board: Board | null;
  columns: Record<string, Column>;
  loading: boolean;
  error: string | null;
}