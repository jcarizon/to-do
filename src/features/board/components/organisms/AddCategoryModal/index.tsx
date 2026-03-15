'use client';

import { Button, Input, Label } from '@/components/ui/atoms';
import { ModalShell } from '@/components/ui/molecules';
import { AddCategoryModalProps } from './types';
import { useAddCategoryModal } from './useAddCategoryModal';

export function AddCategoryModal({ onClose, onSubmit }: AddCategoryModalProps) {
  const { 
    COLUMN_COLORS, 
    title, 
    setTitle, 
    color, 
    setColor, 
    isSubmitting, 
    handleSubmit 
  } = useAddCategoryModal({ onClose, onSubmit });

  const footer = (
    <>
      <span />
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          disabled={!title.trim()}
        >
          Create column
        </Button>
      </div>
    </>
  );

  return (
    <ModalShell
      title="New Column"
      onClose={onClose}
      footer={footer}
      maxWidth="max-w-sm"
    >
      <div className="space-y-5">

        <div className="space-y-1.5">
          <Label htmlFor="col-title">Column name</Label>
          <Input
            id="col-title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g. In Progress"
            className="!bg-zinc-800 !text-zinc-100 !border-zinc-700 focus:!border-zinc-500"
          />
        </div>

        <div className="space-y-2">
          <Label>Color</Label>
          <div className="flex flex-wrap gap-2">
            {COLUMN_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onClick={() => setColor(c.value)}
                className={[
                  'w-6 h-6 rounded-full transition-transform',
                  color === c.value
                    ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-zinc-900'
                    : 'hover:scale-110',
                ].join(' ')}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <div
              className="h-1 w-8 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-zinc-500">
              {title.trim() || 'Column name'} preview
            </span>
          </div>
        </div>

      </div>
    </ModalShell>
  );
}