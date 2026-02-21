import { useState, useEffect } from "react";

const API_BASE_URL = "http://76.13.23.68:8999/api/v1";

export function useTherapists(cityId) {
  const [therapists, setTherapists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cityId) return;

    const fetchTherapists = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/homepage/therapist-dropdown/${cityId}`
        );
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
  }, [cityId]);

  return { therapists, isLoading, error };
}
