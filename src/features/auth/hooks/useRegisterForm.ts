import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { registerUser } from "../store/authSlice";
import { FieldErrors } from "../types";

export const useRegisterForm = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading, error } = useAppSelector((state) => state.auth);
  
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    const validate = (): boolean => {
      const errors: FieldErrors = {};
  
      if (!displayName.trim()) {
        errors.displayName = 'Name is required.';
      }
      if (!email.trim()) {
        errors.email = 'Email is required.';
      }
      if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters.';
      }
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.';
      }
  
      setFieldErrors(errors);
      return Object.keys(errors).length === 0;
    }
  
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
  
      const result = await dispatch(registerUser({ email, password, displayName }));
      if (registerUser.fulfilled.match(result)) {
        router.push('/board');
      }
    }
  
  return {
    handleSubmit,
    displayName,
    setDisplayName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    fieldErrors,
    loading,
    error,
  };
};