import { useState } from "react";
import { ENDPOINTS } from "@/lib/endpoints";
import { useAuthFetch } from "@/hooks/useAuthFetch";

export const PENDING_BOOKING_KEY = "fisiobook_pending_booking";
const HOME_VISIT_SERVICE_ID = 1;

export function buildReservationPayload({
  cityId,
  dateTime,
  therapistCode,
  address,
  addressDetail,
  serviceId,
}) {
  return {
    city_id: Number(cityId),
    dateTime,
    serviceId: Number(serviceId) || HOME_VISIT_SERVICE_ID,
    therapistCode,
    address,
    addressDetail,
  };
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export async function createReservation(token, payload) {
  try {
    const response = await fetch(ENDPOINTS.CREATE_RESERVATION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    const json = await readJson(response);

    if (!response.ok || json.success === false) {
      return {
        success: false,
        unauthorized: response.status === 401,
        message:
          json.message || json.messageTitle || "Gagal membuat reservasi.",
      };
    }

    return { success: true, data: json.data };
  } catch {
    return {
      success: false,
      message: "Tidak dapat terhubung ke server. Periksa koneksi Anda.",
    };
  }
}

export function useCreateReservation() {
  const { authFetch } = useAuthFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (payload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authFetch(ENDPOINTS.CREATE_RESERVATION, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const json = await readJson(response);

      if (!response.ok || json.success === false) {
        const message =
          json.message || json.messageTitle || "Gagal membuat reservasi.";
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
