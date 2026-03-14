import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { clearError, registerUser } from "../store/authSlice";

export const useRegisterForm = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading, error } = useAppSelector((state) => state.auth);
  
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [localError, setLocalError] = useState("");
  
    async function handleSubmit(e: FormEvent) {
      e.preventDefault();
      setLocalError("");
      dispatch(clearError());
  
      if (password !== confirm) {
        setLocalError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setLocalError("Password must be at least 6 characters.");
        return;
      }
  
      const result = await dispatch(registerUser({ email, password, displayName }));
      if (registerUser.fulfilled.match(result)) {
        router.push("/board");
      }
    }
  
    const combinedError = localError || error;
  return {
    handleSubmit,
    displayName,
    setDisplayName,
    email,
    setEmail,
    password,
    setPassword,
    confirm,
    setConfirm,
    combinedError,
    loading,
    error,
  };
};