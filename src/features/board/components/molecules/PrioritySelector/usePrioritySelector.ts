import { Priority } from "@/features/tickets/types";
import { useState } from "react";
import { PrioritySelectorProps } from "./types";

export const usePrioritySelector = ({ priorities,
  selected,
  onChange,
  onUpdatePriorities,
}: PrioritySelectorProps) => {
  const PRESET_COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");

  const sorted = [...priorities].sort((a, b) => a.order - b.order);

  const handleAdd = () => {
    if (!newLabel.trim() || !onUpdatePriorities) return;
    const next: Priority = {
      id: crypto.randomUUID(),
      label: newLabel.trim(),
      color: newColor,
      order: priorities.length,
    };
    onUpdatePriorities([...priorities, next]);
    setNewLabel("");
    setNewColor(PRESET_COLORS[0]);
  };

  const handleDelete = (id: string) => {
    if (!onUpdatePriorities) return;
    onUpdatePriorities(
      priorities.filter((p) => p.id !== id).map((p, i) => ({ ...p, order: i }))
    );
    if (selected === id) onChange(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0 || !onUpdatePriorities) return;
    const next = [...sorted];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onUpdatePriorities(next.map((p, i) => ({ ...p, order: i })));
  };

  const handleMoveDown = (index: number) => {
    if (index === sorted.length - 1 || !onUpdatePriorities) return;
    const next = [...sorted];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onUpdatePriorities(next.map((p, i) => ({ ...p, order: i })));
  };

  const handleRenameStart = (p: Priority) => {
    setEditingId(p.id);
    setEditingLabel(p.label);
  };

  const handleRenameCommit = () => {
    if (!editingId || !onUpdatePriorities) return;
    onUpdatePriorities(
      priorities.map((p) =>
        p.id === editingId
          ? { ...p, label: editingLabel.trim() || p.label }
          : p
      )
    );
    setEditingId(null);
  };

  return {
    PRESET_COLORS,
    sorted,
    isEditing,
    setIsEditing,
    newLabel,
    setNewLabel,
    newColor,
    setNewColor,
    handleAdd,
    handleDelete,
    handleMoveUp,
    handleMoveDown,
    handleRenameStart,
    handleRenameCommit,
    editingId,
    editingLabel,
    setEditingLabel,
  };
}