import { useState } from "react";
import { API_BASE_URL, ENDPOINTS } from "@/lib/endpoints";
import { useAuthFetch } from "@/hooks/useAuthFetch";

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function invoiceUrlFrom(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/^https?:\/\//i.test(text)) return text;
  return `${API_BASE_URL}/download?fileName=${text.replace(/^\/+/, "")}`;
}

function extractTransferInvoice(json) {
  const data = json?.data;
  const candidates = [
    typeof data === "string" ? data : "",
    data?.transferInvoice,
    data?.url,
    data?.fileUrl,
    data?.fileURL,
    data?.path,
    data?.fileName,
    data?.file_name,
    data?.filename,
    json?.transferInvoice,
    json?.url,
    json?.fileName,
  ];

  for (const candidate of candidates) {
    const url = invoiceUrlFrom(candidate);
    if (url) return url;
  }
  return "";
}

function errorMessage(json, fallback) {
  return json?.message || json?.messageTitle || fallback;
}

export function useTransferPayment() {
  const { authFetch } = useAuthFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ code, bankCode, accountNumber, accountName, proof }) => {
    if (!code || code === "-") {
      const message = "Kode booking tidak ditemukan.";
      setError(message);
      return { success: false, message };
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", proof);

      const uploadResponse = await authFetch(ENDPOINTS.UPLOAD_TRANSFER_PROOF, {
        method: "POST",
        body: formData,
      });
      const uploadJson = await readJson(uploadResponse);

      if (!uploadResponse.ok || uploadJson.success === false) {
        const message = errorMessage(uploadJson, "Gagal mengunggah bukti transfer.");
        setError(message);
        return { success: false, message };
      }

      const transferInvoice = extractTransferInvoice(uploadJson);
      if (!transferInvoice) {
        const message = "URL bukti transfer tidak ditemukan.";
        setError(message);
        return { success: false, message };
      }

      const paymentUrl = ENDPOINTS.CREATE_TRANSFER_PAYMENT.replace(
        ":code",
        encodeURIComponent(code),
      );
      const paymentResponse = await authFetch(paymentUrl, {
        method: "POST",
        body: JSON.stringify({
          bankCode,
          accountNumber,
          accountName,
          transferInvoice,
        }),
      });
      const paymentJson = await readJson(paymentResponse);

      if (!paymentResponse.ok || paymentJson.success === false) {
        const message = errorMessage(paymentJson, "Gagal membuat pembayaran.");
        setError(message);
        return { success: false, message };
      }

      return { success: true, data: paymentJson.data, transferInvoice };
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
