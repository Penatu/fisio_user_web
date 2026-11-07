import { useCallback, useEffect, useRef, useState } from "react";
import { ENDPOINTS } from "@/lib/endpoints";
import { useAuthFetch } from "@/hooks/useAuthFetch";

function readPath(source, path) {
  return path.split(".").reduce((value, key) => value?.[key], source);
}

function textValue(value) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value).trim();
  return "";
}

function firstText(source, paths) {
  for (const path of paths) {
    const value = textValue(readPath(source, path));
    if (value) return value;
  }
  return "";
}

function firstNumber(source, paths) {
  for (const path of paths) {
    const value = readPath(source, path);
    if (value == null || value === "") continue;
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return null;
}

function formatLongDate(value) {
  if (!value) return "";
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return String(value);

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTimeRange(startTime, endTime) {
  if (startTime && endTime) return `${startTime} - ${endTime}`;
  return startTime || endTime || "";
}

function durationFromRange(startTime, endTime) {
  if (!startTime || !endTime) return "";
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  if ([startHour, startMinute, endHour, endMinute].some(Number.isNaN)) return "";

  let minutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
  if (minutes <= 0) minutes += 24 * 60;
  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return hours === 1 ? "60 menit" : `${hours} jam`;
  }
  if (minutes < 60) return `${minutes} menit`;
  return `${Math.floor(minutes / 60)} jam ${minutes % 60} menit`;
}

function unwrapDetail(payload) {
  if (!payload || typeof payload !== "object") return {};
  if (payload.detail && typeof payload.detail === "object") return payload.detail;
  if (payload.booking && typeof payload.booking === "object" && !payload.code) {
    return payload.booking;
  }
  if (payload.transaction && typeof payload.transaction === "object") {
    return payload.transaction;
  }
  return payload;
}

function flagValue(item, key) {
  if (!Object.prototype.hasOwnProperty.call(item, key)) return undefined;
  return Boolean(item[key]);
}

export function mapTransactionDetail(payload) {
  const item = unwrapDetail(payload);
  const startTime = firstText(item, ["startTime", "start_time"]);
  const endTime = firstText(item, ["endTime", "end_time"]);
  const address = [
    firstText(item, ["address", "fullAddress", "address.fullAddress", "address.address"]),
    firstText(item, ["addressDetail", "address_detail", "address.detail"]),
  ]
    .filter(Boolean)
    .join(", ");
  const sessionDate = firstText(item, ["date", "dateTime", "date_time"]);

  return {
    id: firstText(item, ["code", "bookingCode", "id"]) || "-",
    refNumber: firstText(item, ["refNumber", "ref_number"]),
    status: firstText(item, ["status"]),
    statusLabel: firstText(item, ["statusLabel", "status_label"]) || firstText(item, ["status"]),
    paymentStatus: firstText(item, ["paymentStatus", "payment.status", "payment_status"]),
    paymentLabel:
      firstText(item, ["paymentLabel", "payment.label", "paymentStatus"]) || "",
    bookingDate: formatLongDate(
      firstText(item, ["bookingDate", "createdAt", "created_at"]) || sessionDate
    ),
    therapistName:
      firstText(item, ["therapistName", "therapist.name", "therapist.fullName"]) || "-",
    therapistSpecialty:
      firstText(item, ["therapyType", "serviceName", "therapist.field", "service.name"]) || "-",
    therapistEmail: firstText(item, ["therapistEmail", "therapist.email"]),
    therapistPhone: firstText(item, [
      "therapistPhone",
      "therapist.phone",
      "therapist.phoneNumber",
    ]),
    date: formatLongDate(sessionDate),
    fullDate: formatLongDate(sessionDate),
    time: formatTimeRange(startTime, endTime),
    duration:
      firstText(item, ["duration", "durationLabel"]) || durationFromRange(startTime, endTime),
    location: firstText(item, ["city", "cityName", "location"]) || "-",
    address,
    paymentMethod: firstText(item, [
      "paymentMethod",
      "payment.method",
      "payment.paymentMethod",
    ]),
    paymentDate: formatLongDate(
      firstText(item, ["paymentDate", "paidAt", "payment.paidAt", "payment.date"])
    ),
    serviceFee: firstNumber(item, ["serviceFee", "sessionFee", "subtotal", "service.price"]),
    adminFee: firstNumber(item, ["adminFee", "admin_fee"]),
    amount: firstNumber(item, ["total", "amount", "grandTotal"]) ?? 0,
    canChat: flagValue(item, "canChat"),
    canCancel: flagValue(item, "canCancel"),
    canReschedule: flagValue(item, "canReschedule"),
    canBookAgain: flagValue(item, "canBookAgain"),
    canInvoice: flagValue(item, "canInvoice"),
  };
}

export function useTransactionDetail(code) {
  const { authFetch } = useAuthFetch();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(code));
  const [error, setError] = useState(null);
  const authFetchRef = useRef(authFetch);
  authFetchRef.current = authFetch;

  const load = useCallback(
    async (signal) => {
      if (!code) {
        setBooking(null);
        setError("Kode booking tidak ditemukan.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const url = ENDPOINTS.GET_TRANSACTION_DETAILS.replace(
          ":code",
          encodeURIComponent(code)
        );
        const response = await authFetchRef.current(url, { signal });
        const json = await response.json();

        if (!response.ok || json.success === false) {
          throw new Error(json.message || "Gagal memuat detail transaksi.");
        }

        setBooking(mapTransactionDetail(json.data ?? json));
      } catch (err) {
        if (err?.name === "AbortError") return;
        setBooking(null);
        setError(err?.message || "Tidak dapat memuat detail transaksi.");
      } finally {
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [code]
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const reload = useCallback(() => load(), [load]);

  return { booking, isLoading, error, reload };
}
