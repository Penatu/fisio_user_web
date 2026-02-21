import { useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

export const API_BASE_URL = "http://76.13.23.68:8999/api/v1";

/**
 * Hook untuk fetch ke API dengan Authorization header otomatis.
 * Jika server mengembalikan 401 (token expired/invalid), user di-logout otomatis.
 */
export function useAuthFetch() {
  const { token, logout } = useAuthContext();

  const authFetch = useCallback(
    async (endpoint, options = {}) => {
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
