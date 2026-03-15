import { useId, useState } from "react";

export const usePasswordField = (idProp?: string) => {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const errorId = `${id}-error`;

  return { 
    visible, 
    setVisible, 
    id, 
    errorId 
  };
};