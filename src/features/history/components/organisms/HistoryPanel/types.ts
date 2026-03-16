interface HistoryPanelProps {
  uid: string;
  boardId: string;
  onClose: () => void;
}

type HistoryTab = 'board' | 'ticket';
 
interface UseHistoryPanelArgs { uid: string; boardId: string; }

export type { 
  HistoryPanelProps, 
  HistoryTab, 
  UseHistoryPanelArgs 
};