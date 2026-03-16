import { formatDistanceToNow, parseISO } from 'date-fns';
import { TicketHistoryEventRowProps } from './types';
 
export function TicketHistoryEventRow({ event }: TicketHistoryEventRowProps) {
  const timeAgo = (() => {
    try { return formatDistanceToNow(parseISO(event.timestamp), { addSuffix: true }); }
    catch { return '—'; }
  })();
 
  return (
    <div className="flex items-start gap-2.5 py-2.5 border-b border-zinc-800/60 last:border-0">
      <span className="mt-0.5 text-[10px] font-semibold tracking-wide uppercase
        flex-shrink-0 text-indigo-400 w-20 truncate">
        {event.field}
      </span>
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-zinc-500 line-through truncate max-w-[80px]">
            {event.oldValue || '—'}
          </span>
          <span className="text-zinc-600 text-[10px]">→</span>
          <span className="text-xs text-zinc-300 truncate max-w-[80px]">
            {event.newValue || '—'}
          </span>
        </div>
        <p className="text-[10px] text-zinc-600">{timeAgo}</p>
      </div>
    </div>
  );
}

