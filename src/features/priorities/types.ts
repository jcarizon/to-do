export interface PriorityLevel {
  id: string;
  boardId: string;
  label: string;
  color: string;
  order: number;
}

export interface PrioritiesState {
  levels: Record<string, PriorityLevel>;
  loading: boolean;
  error: string | null;
}