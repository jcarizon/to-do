export interface Board {
  id: string;
  title: string;
  createdAt: string;
  columnOrder: string[];
}

export interface Column {
  id: string;
  boardId: string;
  title: string;
  color: string;
  order: number;
}

export interface BoardState {
  board: Board | null;
  columns: Record<string, Column>;
  loading: boolean;
  error: string | null;
}