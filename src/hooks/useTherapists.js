import { useState, useEffect } from "react";
import { ENDPOINTS } from "@/lib/endpoints";

function toDateParam(date) {
  if (!date) return "";
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;

  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return "";

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useTherapists(cityId, date) {
  const [therapists, setTherapists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dateParam = toDateParam(date);

  useEffect(() => {
    if (!cityId || !dateParam) return;

    const fetchTherapists = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const path = ENDPOINTS.THERAPIST_DROPDOWN.replace(
          ":cityId",
          encodeURIComponent(cityId)
        );
        const response = await fetch(`${path}?date=${encodeURIComponent(dateParam)}`);
        const json = await response.json();

        if (!response.ok || !json.success) {
          throw new Error(json.message || "Gagal memuat daftar terapis.");
        }

        setTherapists(json.data);
      } catch {
        setError("Tidak dapat memuat daftar terapis.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTherapists();
  }, [cityId, dateParam]);

  return { therapists, isLoading, error };
}
