import { useState } from "react";
import { ENDPOINTS } from "@/lib/endpoints";

export function useVerifyOtp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ email, otp }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(ENDPOINTS.VERIFY_OTP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: Number(otp) }),
      });

      let json = {};
      try {
        json = await response.json();
      } catch {
        json = {};
      }

      if (!response.ok || !json.success) {
        const message =
          json.message || json.messageTitle || "Verifikasi gagal. Coba lagi.";
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
