import { useCallback, useEffect, useRef, useState } from "react";
import { ENDPOINTS } from "@/lib/endpoints";
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

  return {
    id: readText(item, ["id", "code", "roomId", "roomCode"]) || `room-${index}`,
    yourChatRef: readText(item, ["yourChatRef"]),
    profilePicture: readText(item, ["profilePicture", "profile_picture", "avatar"]),
    therapistName,
    therapistInitial: initials(therapistName),
    lastMessage,
    time: formatRoomTime(
      readText(item, ["lastMessageAt", "updatedAt", "lastMessageTime", "createdAt"]),
    ),
    unread: Number(item?.notifCount ?? item?.unreadCount ?? item?.unread ?? 0) || 0,
  };
}

export function useChatRooms() {
  const { authFetch } = useAuthFetch();
  const [rooms, setRooms] = useState([]);
  const [yourChatRef, setYourChatRef] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const authFetchRef = useRef(authFetch);
  authFetchRef.current = authFetch;

  const reload = useCallback(async (signal) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authFetchRef.current(ENDPOINTS.GET_CHAT_ROOMS, { signal });
      const json = await response.json();

      if (!response.ok || json.success === false) {
        throw new Error(json.message || json.messageTitle || "Gagal memuat chat.");
      }

      const rawRooms = extractRooms(json);
      const envelopeRef = readText(json, ["yourChatRef", "data.yourChatRef"]);
      const mappedRooms = rawRooms.map((item, index) => {
        const room = mapChatRoom(item, index);
        return {
          ...room,
          yourChatRef: room.yourChatRef || envelopeRef,
        };
      });

      setYourChatRef(
        envelopeRef || mappedRooms.find((room) => room.yourChatRef)?.yourChatRef || "",
      );
      setRooms(mappedRooms);
    } catch (err) {
      if (err?.name === "AbortError") return;
      setRooms([]);
      setYourChatRef("");
      setError(err?.message || "Tidak dapat memuat chat.");
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    reload(controller.signal);
    return () => controller.abort();
  }, [reload]);

  return { rooms, yourChatRef, isLoading, error, reload: () => reload() };
}
