import { useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

/**
 * Hook untuk fetch ke API dengan Authorization header otomatis.
 * `url` harus URL lengkap dari ENDPOINTS.
 * Jika server mengembalikan 401 (token expired/invalid), user di-logout otomatis.
 */
export function useAuthFetch() {
  const { token, logout } = useAuthContext();

  const authFetch = useCallback(
    async (url, options = {}) => {
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        logout();
        throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
      }

      return response;
    },
    [token, logout]
  );

  return { authFetch };
}
