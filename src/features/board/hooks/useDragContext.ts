import { createContext, useContext } from 'react';
import { DragContextValue } from '../types';

export const DragContext = createContext<DragContextValue>({
  dragging: null,
  setDragging: () => {},
});

export function useDragContext() {
  return useContext(DragContext);
}