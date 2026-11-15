import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { ENDPOINTS, SOCKET_BASE_URL } from "@/lib/endpoints";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAuthFetch } from "@/hooks/useAuthFetch";

function readText(item, keys) {
  for (const key of keys) {
    const value = key.split(".").reduce((current, part) => current?.[part], item);
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}

function initials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatRoomTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Kemarin";

  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function extractRooms(json) {
  const data = json?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.rooms)) return data.rooms;
  if (Array.isArray(data?.chatRooms)) return data.chatRooms;
  if (Array.isArray(data?.chats)) return data.chats;
  return [];
}

function messageTimestamp(value) {
  if (!value) return 0;
  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}

function compareRoomsByLatest(a, b) {
  return messageTimestamp(b.latestMessageAt) - messageTimestamp(a.latestMessageAt);
}

function mergeLiveRooms(fetchedRooms, liveRooms) {
  const liveById = new Map(liveRooms.map((room) => [room.id, room]));
  return fetchedRooms
    .map((room) => {
      const live = liveById.get(room.id);
      if (!live) return room;
      if (messageTimestamp(live.latestMessageAt) <= messageTimestamp(room.latestMessageAt)) {
        return room;
      }
      return {
        ...room,
        lastMessage: live.lastMessage,
        latestMessageAt: live.latestMessageAt,
        time: live.time,
        unread: live.unread,
      };
    })
    .sort(compareRoomsByLatest);
}

function readNotifCount(value) {
  const count = Number(value);
  return Number.isFinite(count) && count > 0 ? count : 0;
}

export function mapChatRoom(item, index) {
  const therapistName =
    readText(item, ["therapistName", "therapist.name", "name", "participantName"]) ||
    "Terapis";
  const lastMessage =
    readText(item, [
      "lastMessage.text",
      "lastMessage.content",
      "lastMessage",
      "latestMessage",
      "message",
    ]) || "Belum ada pesan";
  const latestMessageAt = readText(item, [
    "latestMessageAt",
    "lastMessageAt",
    "updatedAt",
    "lastMessageTime",
    "createdAt",
  ]);

  return {
    id: readText(item, ["roomId", "id", "code", "roomCode"]) || `room-${index}`,
    yourChatRef: readText(item, ["yourChatRef"]),
    profilePicture: readText(item, ["profilePicture", "profile_picture", "avatar"]),
    therapistName,
    therapistInitial: initials(therapistName),
    lastMessage,
    latestMessageAt,
    time: formatRoomTime(latestMessageAt),
    unread: readNotifCount(item?.notifCount ?? item?.unreadCount ?? item?.unread),
  };
}

const UNKNOWN_ROOM_REFETCH_MS = 3000;

export function useChatRooms() {
  const { token, logout } = useAuthContext();
  const { authFetch } = useAuthFetch();
  const [rooms, setRooms] = useState([]);
  const [yourChatRef, setYourChatRef] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const authFetchRef = useRef(authFetch);
  const logoutRef = useRef(logout);
  const roomsRef = useRef(rooms);
  const reloadRef = useRef(null);
  authFetchRef.current = authFetch;
  logoutRef.current = logout;

  const reload = useCallback(async (signal, { background = false } = {}) => {
    if (!background) {
      setIsLoading(true);
      setError(null);
    }

    try {
      const response = await authFetchRef.current(ENDPOINTS.GET_CHAT_ROOMS, { signal });
      const json = await response.json();

      if (!response.ok || json.success === false) {
        throw new Error(json.message || json.messageTitle || "Gagal memuat chat.");
      }

      const rawRooms = extractRooms(json);
      const envelopeRef = readText(json, ["yourChatRef", "data.yourChatRef"]);
      const mappedRooms = rawRooms
        .map((item, index) => {
          const room = mapChatRoom(item, index);
          return {
            ...room,
            yourChatRef: room.yourChatRef || envelopeRef,
          };
        })
        .sort(compareRoomsByLatest);

      const nextRef =
        envelopeRef || mappedRooms.find((room) => room.yourChatRef)?.yourChatRef || "";
      const nextRooms = background
        ? mergeLiveRooms(mappedRooms, roomsRef.current)
        : mappedRooms;

      roomsRef.current = nextRooms;
      setYourChatRef(nextRef);
      setRooms(nextRooms);
      if (background) setError(null);
      return nextRooms;
    } catch (err) {
      if (err?.name === "AbortError") return null;
      if (!background) {
        roomsRef.current = [];
        setRooms([]);
        setYourChatRef("");
        setError(err?.message || "Tidak dapat memuat chat.");
      }
      return null;
    } finally {
      if (!signal?.aborted && !background) setIsLoading(false);
    }
  }, []);

  reloadRef.current = reload;

  useEffect(() => {
    const controller = new AbortController();
    reload(controller.signal);
    return () => controller.abort();
  }, [reload]);

  useEffect(() => {
    if (!token || !yourChatRef) return undefined;

    let active = true;
    const controller = new AbortController();
    const lastRefetchAt = { current: 0 };

    const socket = io(`${SOCKET_BASE_URL}/room`, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      auth: { token },
      query: {
        userRef: yourChatRef,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        lang: "id",
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    const requestUnknownRoomRefetch = () => {
      if (!active) return;
      const now = Date.now();
      if (now - lastRefetchAt.current < UNKNOWN_ROOM_REFETCH_MS) return;
      lastRefetchAt.current = now;
      reloadRef.current?.(controller.signal, { background: true });
    };

    socket.on("room_notif", (payload) => {
      if (!active) return;
      const updates = Array.isArray(payload?.rooms)
        ? payload.rooms
        : Array.isArray(payload)
          ? payload
          : [];
      if (updates.length === 0) return;

      const map = new Map(roomsRef.current.map((room) => [room.id, room]));
      let hasUnknownRoom = false;
      let changed = false;

      for (const item of updates) {
        const roomId = typeof item?.roomId === "string" ? item.roomId.trim() : "";
        if (!roomId) continue;
        const existing = map.get(roomId);
        if (!existing) {
          hasUnknownRoom = true;
          continue;
        }

        const latestMessageAt =
          typeof item.latestMessageAt === "string" ? item.latestMessageAt : "";
        const latestMessage =
          typeof item.latestMessage === "string" ? item.latestMessage.trim() : "";
        map.set(roomId, {
          ...existing,
          lastMessage: latestMessage || "Belum ada pesan",
          latestMessageAt,
          time: formatRoomTime(latestMessageAt),
          unread: readNotifCount(item?.notifCount),
        });
        changed = true;
      }

      if (changed) {
        const next = Array.from(map.values()).sort(compareRoomsByLatest);
        roomsRef.current = next;
        setRooms(next);
      }

      if (hasUnknownRoom) requestUnknownRoomRefetch();
    });

    socket.on("connect_error", (err) => {
      const detail = err?.data?.message || err?.message || "";
      if (err?.data?.status === 401 && detail !== "invalid userRef") {
        logoutRef.current();
      }
    });

    const refreshOnFocus = () => {
      if (socket.connected) socket.emit("room_notif");
    };
    window.addEventListener("focus", refreshOnFocus);

    return () => {
      active = false;
      controller.abort();
      window.removeEventListener("focus", refreshOnFocus);
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [token, yourChatRef]);

  return { rooms, yourChatRef, isLoading, error, reload: () => reload() };
}
