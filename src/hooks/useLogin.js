import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

const API_BASE_URL = "http://76.13.23.68:8999/api/v1";

export function useLogin() {
  const { login } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ email, password }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth-user/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        const message =
          json.message || json.messageTitle || "Login gagal. Coba lagi.";
        setError(message);
        return { success: false, message };
      }

      login(json.data);
      return { success: true, data: json.data };
    } catch {
      const message = "Tidak dapat terhubung ke server. Periksa koneksi Anda.";
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { mutate, isLoading, error, clearError };
}
