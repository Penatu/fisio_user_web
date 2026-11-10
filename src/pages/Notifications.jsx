import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import {
  ArrowLeft,
  Bell,
  Calendar,
  CheckCheck,
  Clock,
  CreditCard,
  MessageSquare,
} from "lucide-react";

const FILTERS = [
  { value: "all", label: "Semua" },
  { value: "unread", label: "Belum dibaca" },
];

const TYPE_META = {
  booking: {
    icon: Calendar,
    iconClass: "bg-primary text-foreground",
  },
  chat: {
    icon: MessageSquare,
    iconClass: "bg-primary-soft text-foreground",
  },
  payment: {
    icon: CreditCard,
    iconClass: "bg-accent text-foreground",
  },
  reminder: {
    icon: Clock,
    iconClass: "bg-foreground text-background",
  },
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications();

  const visible =
    filter === "unread"
      ? notifications.filter((item) => item.unread)
      : notifications;

  const openNotification = (item) => {
    markRead(item.id);
    if (item.href) navigate(item.href);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                asChild
              >
                <Link to="/" aria-label="Kembali">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="min-w-0">
                <h1 className="text-lg font-bold">Notifikasi</h1>
                <p className="text-xs text-muted-foreground">
                  {unreadCount > 0
                    ? `${unreadCount} belum dibaca`
                    : "Semua sudah dibaca"}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="shrink-0 rounded-full px-3 text-xs font-semibold"
                onClick={markAllRead}
              >
                <CheckCheck className="h-4 w-4" />
                Tandai dibaca
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="px-4 pb-8 pt-2">
        <div className="mb-4 flex gap-2">
          {FILTERS.map((item) => {
            const active = filter === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                aria-pressed={active}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-base font-semibold">
              {filter === "unread"
                ? "Tidak ada yang belum dibaca"
                : "Belum ada notifikasi"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {filter === "unread"
                ? "Semua notifikasi sudah Anda baca."
                : "Update booking, chat, dan pembayaran akan muncul di sini."}
            </p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {visible.map((item) => {
              const meta = TYPE_META[item.type] || TYPE_META.booking;
              const Icon = meta.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => openNotification(item)}
                    className={`flex w-full items-start gap-3 rounded-[22px] px-3.5 py-3.5 text-left transition-colors ${
                      item.unread ? "bg-primary-soft/70" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${meta.iconClass}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold leading-snug">
                          {item.title}
                        </p>
                        {item.unread && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-foreground" />
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/70">
                        {item.body}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {item.time}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
