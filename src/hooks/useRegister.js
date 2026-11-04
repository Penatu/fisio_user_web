import { useState } from "react";
import { ENDPOINTS } from "@/lib/endpoints";

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ email, fullName, phone, password }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, fullName, phone, password }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        const message =
          json.message || json.messageTitle || "Pendaftaran gagal. Coba lagi.";
        setError(message);
        return { success: false, message };
      }

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
