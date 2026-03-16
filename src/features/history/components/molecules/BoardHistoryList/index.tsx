import { HistoryEventRow } from "../../atoms";
import { BoardHistoryListProps } from './types';
 
export function BoardHistoryList({ events }: BoardHistoryListProps) {
  if (events.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-xs text-zinc-600">No board activity yet.</p>
      </div>
    );
  }
  return (
    <div className="divide-y-0">
      {events.map((event) => (
        <HistoryEventRow key={event.id} event={event} />
      ))}
    </div>
  );
}

