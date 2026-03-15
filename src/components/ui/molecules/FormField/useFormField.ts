import { useId } from "react";

export const useFormField = (idProp?: string) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const errorId = `${id}-error`;

  return { id, errorId };
};