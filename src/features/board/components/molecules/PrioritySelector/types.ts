import { Priority } from "@/features/tickets/types";

interface PrioritySelectorProps {
  priorities: Priority[];
  selected: string | null;
  onChange: (priorityId: string | null) => void;
  onUpdatePriorities?: (priorities: Priority[]) => void;
}

export type { PrioritySelectorProps };