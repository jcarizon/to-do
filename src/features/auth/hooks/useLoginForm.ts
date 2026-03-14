import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { loginUser, clearError } from "../store/authSlice";

export const useLoginForm = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading, error } = useAppSelector((state) => state.auth);
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    async function handleSubmit(e: FormEvent) {
      e.preventDefault();
      dispatch(clearError());
      const result = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(result)) {
        router.push("/board");
      }
    }

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  };
};