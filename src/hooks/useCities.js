import { useState, useEffect } from "react";
import { ENDPOINTS } from "@/lib/endpoints";

export function useCities() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(ENDPOINTS.CITIES);
        const json = await response.json();

        if (!response.ok || !json.success) {
          throw new Error(json.message || "Gagal memuat daftar kota.");
        }

        setCities(json.data);
      } catch {
        setError("Tidak dapat memuat daftar kota.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, []);

  return { cities, isLoading, error };
}
