import { useState } from "react";
import { ENDPOINTS } from "@/lib/endpoints";
import { useAuthFetch } from "@/hooks/useAuthFetch";

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export function useCancelReservation() {
  const { authFetch } = useAuthFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (code, reason) => {
    if (!code || code === "-") {
      const message = "Kode booking tidak ditemukan.";
      setError(message);
      return { success: false, message };
    }

    const trimmedReason = String(reason || "").trim();
    if (!trimmedReason) {
      const message = "Isi alasan pembatalan.";
      setError(message);
      return { success: false, message };
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = ENDPOINTS.CANCEL_RESERVATION.replace(
        ":code",
        encodeURIComponent(code),
      );
      const response = await authFetch(url, {
        method: "PUT",
        body: JSON.stringify({ reason: trimmedReason }),
      });
      const json = await readJson(response);

      if (!response.ok || json.success === false) {
        const message =
          json.message || json.messageTitle || "Gagal membatalkan pesanan.";
        setError(message);
        return { success: false, message };
      }

      return { success: true, data: json.data };
    } catch (err) {
      const message =
        err?.message || "Tidak dapat terhubung ke server. Periksa koneksi Anda.";
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { mutate, isLoading, error, clearError };
}
