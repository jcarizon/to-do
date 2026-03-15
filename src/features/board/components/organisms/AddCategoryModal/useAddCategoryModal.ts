import { useState } from "react";
import { AddCategoryModalProps } from "./types";

export const useAddCategoryModal = ({ onClose, onSubmit }: AddCategoryModalProps) => {
  const COLUMN_COLORS = [
    { label: 'Slate',   value: '#64748b' },
    { label: 'Blue',    value: '#3b82f6' },
    { label: 'Indigo',  value: '#6366f1' },
    { label: 'Violet',  value: '#8b5cf6' },
    { label: 'Rose',    value: '#f43f5e' },
    { label: 'Orange',  value: '#f97316' },
    { label: 'Amber',   value: '#f59e0b' },
    { label: 'Emerald', value: '#10b981' },
    { label: 'Teal',    value: '#14b8a6' },
    { label: 'Cyan',    value: '#06b6d4' },
  ];

  const [title, setTitle] = useState('');
  const [color, setColor] = useState(COLUMN_COLORS[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || isSubmitting) return;
    setIsSubmitting(true);
    await onSubmit(title.trim(), color);
    setIsSubmitting(false);
    onClose();
  };

  return { COLUMN_COLORS, title, setTitle, color, setColor, isSubmitting, handleSubmit };
};