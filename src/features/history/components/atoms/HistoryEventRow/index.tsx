import { formatDistanceToNow, parseISO } from 'date-fns';
import { HistoryEventRowProps } from './types';
 
export function HistoryEventRow({ event }: HistoryEventRowProps) {
  const EVENT_TYPE_STYLES: Record<string, string> = {
    COLUMN_CREATED:   'text-green-400',
    COLUMN_DELETED:   'text-red-400',
    COLUMN_REORDERED: 'text-zinc-400',
    TICKET_MOVED:     'text-indigo-400',
  };
  
  const color = EVENT_TYPE_STYLES[event.type] ?? 'text-zinc-400';
  const timeAgo = (() => {
    try { return formatDistanceToNow(parseISO(event.timestamp), { addSuffix: true }); }
    catch { return '—'; }
  })();
 
  return (
    <div className="flex items-start gap-2.5 py-2.5 border-b border-zinc-800/60 last:border-0">
      <span className={`mt-0.5 text-[10px] font-semibold tracking-wide uppercase
        flex-shrink-0 w-20 truncate ${color}`}>
        {event.type.replace(/_/g, ' ')}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-300 leading-relaxed">{event.description}</p>
        <p className="text-[10px] text-zinc-600 mt-0.5">{timeAgo}</p>
      </div>
    </div>
  );
}

