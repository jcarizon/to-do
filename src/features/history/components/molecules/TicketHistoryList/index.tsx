import { TicketHistoryEventRow } from "../../atoms";
import { TicketHistoryListProps } from './types';
 
export function TicketHistoryList({ events }: TicketHistoryListProps) {
  if (events.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-xs text-zinc-600">No changes recorded yet.</p>
      </div>
    );
  }
  return (
    <div className="divide-y-0">
      {events.map((event) => (
        <TicketHistoryEventRow key={event.id} event={event} />
      ))}
    </div>
  );
}

