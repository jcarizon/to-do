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
  createdAt?: string;
  updatedAt?: string;
}

export interface BoardState {
  board: Board | null;
  columns: Record<string, Column>;
  loading: boolean;
  error: string | null;
}