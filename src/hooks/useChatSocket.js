import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { ENDPOINTS, SOCKET_BASE_URL } from "@/lib/endpoints";

function formatMessageTime(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function extractHistory(json) {
  const data = json?.data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.messages)) return data.messages;
  if (Array.isArray(data)) return data;
  return [];
}

function mapHistoryItem(item, index, userRef) {
  const sendAt = item?.sendAt || item?.createdAt || "";
  const actorId = item?.actorId || item?.fromId || "";
  return {
    id: `history-${index}-${sendAt}-${actorId}`,
    actorId,
    text: item?.message || "",
    sendAt,
    time: formatMessageTime(sendAt),
    isSelf: actorId === userRef,
    live: false,
  };
}

export function useChatSocket({ roomId, userRef, onRoomError }) {
  const { token, logout } = useAuthContext();
  const { authFetch } = useAuthFetch();
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [connectionError, setConnectionError] = useState(null);

  const socketRef = useRef(null);
  const authFetchRef = useRef(authFetch);
  const logoutRef = useRef(logout);
  const onRoomErrorRef = useRef(onRoomError);
  const loadHistoryRef = useRef(null);
  const messageSeq = useRef(0);

  authFetchRef.current = authFetch;
  logoutRef.current = logout;
  onRoomErrorRef.current = onRoomError;

  const reloadHistory = useCallback(() => {
    return loadHistoryRef.current?.();
  }, []);

  const sendMessage = useCallback((text) => {
    const value = text.trim();
    if (!value) return false;
    const socket = socketRef.current;
    if (!socket?.connected) return false;
    socket.emit("message", { message: value });
    return true;
  }, []);

  useEffect(() => {
    if (!token || !roomId || !userRef) {
      setMessages([]);
      setIsConnected(false);
      setPartnerOnline(false);
      setIsHistoryLoading(false);
      setHistoryError(null);
      setConnectionError(null);
      return undefined;
    }

    let active = true;
    const controller = new AbortController();

    setMessages([]);
    setIsConnected(false);
    setPartnerOnline(false);
    setConnectionError(null);
    setHistoryError(null);
    setIsHistoryLoading(true);

    const loadHistory = async () => {
      setIsHistoryLoading(true);
      setHistoryError(null);

      try {
        const params = new URLSearchParams({
          roomId,
          page: "1",
          perPage: "50",
        });
        const response = await authFetchRef.current(
          `${ENDPOINTS.GET_CHAT_HISTORY}?${params.toString()}`,
          { signal: controller.signal },
        );
        const json = await response.json();

        const status = Number(json.status);
        const statusFailed = Number.isFinite(status) && status >= 400;
        if (!response.ok || json.success === false || statusFailed) {
          throw new Error(json.message || json.messageTitle || "Gagal memuat pesan.");
        }

        const history = extractHistory(json)
          .map((item, index) => mapHistoryItem(item, index, userRef))
          .filter((item) => item.text)
          .sort((a, b) => {
            const left = new Date(a.sendAt).getTime();
            const right = new Date(b.sendAt).getTime();
            if (Number.isNaN(left) || Number.isNaN(right)) return 0;
            return left - right;
          });

        if (!active) return;

        setMessages((current) => {
          const live = current.filter((item) => item.live);
          const extras = live.filter(
            (item) =>
              !history.some(
                (saved) => saved.actorId === item.actorId && saved.text === item.text,
              ),
          );
          return [...history, ...extras];
        });
      } catch (err) {
        if (err?.name === "AbortError" || !active) return;
        setHistoryError(err?.message || "Tidak dapat memuat pesan.");
      } finally {
        if (active) setIsHistoryLoading(false);
      }
    };

    loadHistoryRef.current = loadHistory;
    loadHistory();

    const socket = io(`${SOCKET_BASE_URL}/chat`, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      auth: { token },
      query: {
        userRef,
        roomId,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta",
        lang: "id",
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      if (!active) return;
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on("disconnect", () => {
      if (!active) return;
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      const detail = err?.data?.message || err?.message || "Gagal terhubung ke chat.";
      if (err?.data?.status === 401 && detail !== "invalid userRef") {
        logoutRef.current();
        return;
      }
      if (!active) return;
      setIsConnected(false);
      setConnectionError(detail);
    });

    socket.on("message", (payload, ackCallback) => {
      if (typeof ackCallback === "function") {
        ackCallback({ ack: true, time: new Date().toISOString() });
      }
      if (!active || !payload?.message) return;

      const actorId = payload.actorId || "";
      const sendAt =
        typeof payload.sendAt === "string" && payload.sendAt.trim()
          ? payload.sendAt
          : new Date().toISOString();
      messageSeq.current += 1;

      setMessages((current) => [
        ...current,
        {
          id: `live-${messageSeq.current}-${sendAt}`,
          actorId,
          text: payload.message,
          sendAt,
          time: formatMessageTime(sendAt),
          isSelf: actorId === userRef,
          live: true,
        },
      ]);
    });

    const handleJoin = (payload) => {
      if (!active || !payload?.actorId || payload.actorId === userRef) return;
      setPartnerOnline(true);
    };

    socket.on("notify_join", handleJoin);
    socket.on("Notify_join", handleJoin);

    socket.on("Notify_leave", (payload) => {
      if (!active || !payload?.actorId || payload.actorId === userRef) return;
      setPartnerOnline(false);
    });

    socket.on("alert_error", (msg, ackCallback) => {
      if (typeof ackCallback === "function") ackCallback();
      const text = typeof msg === "string" && msg.trim() ? msg : "Room tidak valid";
      if (!active) return;
      setConnectionError(text);
      onRoomErrorRef.current?.(text);
    });

    return () => {
      active = false;
      controller.abort();
      loadHistoryRef.current = null;
      socket.removeAllListeners();
      socket.disconnect();
      if (socketRef.current === socket) socketRef.current = null;
    };
  }, [token, roomId, userRef]);

  return {
    messages,
    isConnected,
    partnerOnline,
    isHistoryLoading,
    historyError,
    connectionError,
    sendMessage,
    reloadHistory,
  };
}
