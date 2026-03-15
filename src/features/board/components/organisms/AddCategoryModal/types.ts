interface AddCategoryModalProps {
  onClose: () => void;
  onSubmit: (title: string, color: string) => Promise<void>;
}

export type { AddCategoryModalProps };