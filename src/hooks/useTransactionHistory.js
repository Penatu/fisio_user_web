import { useCallback, useEffect, useRef, useState } from "react";
import { ENDPOINTS } from "@/lib/endpoints";
import { useAuthFetch } from "@/hooks/useAuthFetch";

const PER_PAGE = 10;

function formatDateLabel(value) {
  if (!value) return "-";
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return String(value);

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTimeRange(startTime, endTime) {
  if (startTime && endTime) return `${startTime} - ${endTime}`;
  return startTime || endTime || "";
}

export function mapHistoryItem(item) {
  return {
    id: item.code || "-",
    refNumber: item.refNumber || "",
    therapistName: item.therapistName || "-",
    therapistSpecialty: item.therapyType || "-",
    therapistCode: item.therapistCode || "",
    location: item.city || "-",
    date: formatDateLabel(item.date || item.dateTime),
    fullDate: formatDateLabel(item.date || item.dateTime),
    time: formatTimeRange(item.startTime, item.endTime),
    status: item.status || "",
    statusLabel: item.statusLabel || item.status || "",
    amount: Number(item.total) || 0,
    paymentStatus: item.paymentStatus || "",
    paymentLabel: item.paymentLabel || item.paymentStatus || "",
    canChat: Boolean(item.canChat),
    canReschedule: Boolean(item.canReschedule),
    canBookAgain: Boolean(item.canBookAgain),
    canInvoice: Boolean(item.canInvoice),
  };
}

function extractList(json) {
  if (Array.isArray(json?.data?.histories)) return json.data.histories;
  return [];
}

function mapSummary(summary) {
  if (!summary) return null;
  return {
    totalBooking: Number(summary.totalBooking) || 0,
    completed: Number(summary.completed) || 0,
    upcoming: Number(summary.upcoming) || 0,
    canceled: Number(summary.canceled) || 0,
  };
}

function appendUnique(current, next) {
  const seen = new Set(
    current.map((item) => item.id).filter((id) => id && id !== "-")
  );
  return [
    ...current,
    ...next.filter((item) => !item.id || item.id === "-" || !seen.has(item.id)),
  ];
}

function hasNextPage(pagination, nextPage, receivedCount, totalCount) {
  if (receivedCount === 0) return false;
  if (pagination.nextPage !== undefined && pagination.nextPage !== null) {
    return Number(pagination.nextPage) > 0;
  }

  const lastPage = Number(pagination.totalPage || pagination.lastPage || 0);
  if (lastPage) return nextPage < lastPage;
  if (totalCount) return nextPage * PER_PAGE < totalCount;
  return receivedCount === PER_PAGE;
}

export function useTransactionHistory(status) {
  const { authFetch } = useAuthFetch();
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const authFetchRef = useRef(authFetch);
  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);
  const statusRef = useRef(status);

  authFetchRef.current = authFetch;
  statusRef.current = status;

  const fetchPage = useCallback(async (nextPage, { replace, signal } = {}) => {
    if (loadingRef.current && !replace) return;
    loadingRef.current = true;

    if (replace) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        perPage: String(PER_PAGE),
      });
      if (statusRef.current) params.set("status", statusRef.current);

      const response = await authFetchRef.current(
        `${ENDPOINTS.GET_TRANSCATION_HISTORY}?${params.toString()}`,
        { signal }
      );
      const json = await response.json();

      if (!response.ok || json.success === false) {
        throw new Error(json.message || "Gagal memuat riwayat.");
      }

      const list = extractList(json).map(mapHistoryItem);
      const pagination = json.data?.pagination || {};
      const totalCount = Number(pagination.total) || 0;
      const nextSummary = mapSummary(json.data?.summary);

      setItems((current) => (replace ? list : appendUnique(current, list)));
      setTotal(totalCount);
      if (nextSummary) setSummary(nextSummary);
      pageRef.current = nextPage;

      const more = hasNextPage(pagination, nextPage, list.length, totalCount);
      hasMoreRef.current = more;
      setHasMore(more);
      setError(null);
    } catch (err) {
      if (err?.name === "AbortError") return;
      setError(err?.message || "Tidak dapat memuat riwayat.");
      if (replace) {
        setItems([]);
        setSummary(null);
        setTotal(0);
        hasMoreRef.current = false;
        setHasMore(false);
      }
    } finally {
      if (!signal?.aborted) {
        loadingRef.current = false;
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    pageRef.current = 0;
    hasMoreRef.current = true;
    setItems([]);
    setHasMore(true);
    fetchPage(1, { replace: true, signal: controller.signal });

    return () => {
      controller.abort();
      loadingRef.current = false;
    };
  }, [status, fetchPage]);

  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMoreRef.current) return;
    fetchPage(pageRef.current + 1, { replace: false });
  }, [fetchPage]);

  const reload = useCallback(() => {
    pageRef.current = 0;
    hasMoreRef.current = true;
    fetchPage(1, { replace: true });
  }, [fetchPage]);

  return {
    items,
    summary,
    total,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    reload,
  };
}
