import { useSyncExternalStore } from "react";

const INITIAL_NOTIFICATIONS = [
  {
    id: "booking-confirmed",
    type: "booking",
    title: "Booking dikonfirmasi",
    body: "Sesi fisioterapi Anda sudah dikonfirmasi oleh terapis.",
    time: "5 menit lalu",
    unread: true,
    href: "/history",
  },
  {
    id: "chat-message",
    type: "chat",
    title: "Pesan baru dari terapis",
    body: "Terapis mengirim pesan tentang jadwal kunjungan besok.",
    time: "1 jam lalu",
    unread: true,
    href: "/chat",
  },
  {
    id: "payment-pending",
    type: "payment",
    title: "Menunggu pembayaran",
    body: "Selesaikan pembayaran sebelum jadwal kunjungan dimulai.",
    time: "Kemarin",
    unread: true,
    href: "/history",
  },
  {
    id: "session-reminder",
    type: "reminder",
    title: "Pengingat jadwal",
    body: "Sesi fisioterapi Anda dimulai besok pukul 10.00.",
    time: "2 hari lalu",
    unread: false,
    href: "/history",
  },
  {
    id: "session-done",
    type: "booking",
    title: "Sesi selesai",
    body: "Riwayat kunjungan terakhir sudah tersedia di History.",
    time: "3 hari lalu",
    unread: false,
    href: "/history",
  },
];

let notifications = INITIAL_NOTIFICATIONS;
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return notifications;
}

export function useNotifications() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const unreadCount = items.filter((item) => item.unread).length;

  const markRead = (id) => {
    const current = notifications.find((item) => item.id === id);
    if (!current?.unread) return;
    notifications = notifications.map((item) =>
      item.id === id ? { ...item, unread: false } : item,
    );
    emit();
  };

  const markAllRead = () => {
    if (!notifications.some((item) => item.unread)) return;
    notifications = notifications.map((item) =>
      item.unread ? { ...item, unread: false } : item,
    );
    emit();
  };

  return { notifications: items, unreadCount, markRead, markAllRead };
}
