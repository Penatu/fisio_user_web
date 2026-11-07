import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  MessageSquare,
  Download,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const ORDER_STATUSES = [
  { value: "all", label: "Semua", query: "" },
  { value: "new", label: "Pesanan baru", query: "new" },
  { value: "confirmed", label: "Dikonfirmasi", query: "confirmed" },
  { value: "visit", label: "Kunjungan", query: "visit" },
  { value: "completed", label: "Selesai", query: "completed" },
  { value: "cancelled", label: "Dibatalkan", query: "canceled" },
];

const STATUS_QUERY = Object.fromEntries(
  ORDER_STATUSES.map((item) => [item.value, item.query]),
);

const STATUS_LABELS = {
  new: "Pesanan baru",
  confirmed: "Dikonfirmasi",
  visit: "Proses Kunjungan",
  in_progress: "Proses Kunjungan",
  completed: "Selesai",
  canceled: "Dibatalkan",
  cancelled: "Dibatalkan",
};

const STATUS_STYLES = {
  new: "bg-secondary text-foreground border-transparent",
  confirmed: "bg-primary-soft text-foreground border-transparent",
  visit: "bg-primary/15 text-foreground border-transparent",
  in_progress: "bg-primary/15 text-foreground border-transparent",
  completed: "bg-accent/40 text-foreground border-transparent",
  canceled: "bg-destructive/10 text-destructive border-destructive/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const CHAT_HIDDEN_STATUSES = new Set([
  "completed",
  "canceled",
  "cancelled",
]);

const CHAT_ENABLED_STATUSES = new Set(["confirmed", "visit", "in_progress"]);

function isChatVisible(status) {
  return !CHAT_HIDDEN_STATUSES.has(String(status || "").toLowerCase());
}

function isChatEnabled(status) {
  return CHAT_ENABLED_STATUSES.has(String(status || "").toLowerCase());
}

function needsPaymentBeforeVisit(status, paymentStatus) {
  const order = String(status || "").toLowerCase();
  const payment = String(paymentStatus || "").toLowerCase();
  const isVisit =
    order === "visit" || order === "in_progress" || order === "inprogress";
  const isPaid = payment === "paid" || payment === "lunas";
  return isVisit && !isPaid;
}

function PaymentBeforeVisitNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
      <div>
        <p className="text-sm font-semibold">Info penting</p>
        <p className="text-sm">Lakukan pembayaran sebelum kunjungan.</p>
      </div>
    </div>
  );
}

function StatusBadge({ status, label }) {
  return (
    <Badge
      className={`rounded-full border font-medium ${
        STATUS_STYLES[status] || "bg-muted text-foreground border-border"
      }`}
    >
      {label || STATUS_LABELS[status] || status}
    </Badge>
  );
}

function PaymentStatusBadge({ status, label }) {
  const styles = {
    paid: "bg-accent/40 text-foreground border-transparent",
    pending: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    refunded: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Badge
      className={`rounded-full border font-medium ${
        styles[status] || "bg-muted text-foreground border-border"
      }`}
    >
      {label || status}
    </Badge>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const sentinelRef = useRef(null);
  const {
    items,
    summary,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    reload,
  } = useTransactionHistory(STATUS_QUERY[activeTab]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, items.length]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg">
        <div className="mx-auto px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full md:hidden"
                asChild
              >
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-lg font-bold">History</h1>
                <p className="text-xs text-muted-foreground">
                  Riwayat booking Anda
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">
        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <Card className="rounded-2xl p-4 shadow-sm">
            <p className="mb-1 text-2xl font-bold">
              {summary?.totalBooking ?? "–"}
            </p>
            <p className="text-xs text-muted-foreground">Total Booking</p>
          </Card>
          <Card className="rounded-2xl p-4 shadow-sm">
            <p className="mb-1 text-2xl font-bold">
              {summary?.completed ?? "–"}
            </p>
            <p className="text-xs text-muted-foreground">Selesai</p>
          </Card>
          <Card className="rounded-2xl p-4 shadow-sm">
            <p className="mb-1 text-2xl font-bold">
              {summary?.upcoming ?? "–"}
            </p>
            <p className="text-xs text-muted-foreground">Akan Datang</p>
          </Card>
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-full bg-secondary/50 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ORDER_STATUSES.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="h-8 shrink-0 rounded-full px-3 text-xs font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading && items.length === 0 ? (
              <Card className="rounded-2xl p-12 text-center shadow-sm">
                <p className="text-sm text-muted-foreground">
                  Memuat riwayat...
                </p>
              </Card>
            ) : error && items.length === 0 ? (
              <Card className="rounded-2xl p-12 text-center shadow-sm">
                <p className="text-sm text-destructive">{error}</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 rounded-full"
                  onClick={reload}
                >
                  Coba lagi
                </Button>
              </Card>
            ) : items.length === 0 ? (
              <Card className="rounded-2xl p-12 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Tidak ada booking
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {items.map((booking, index) => (
                  <Card
                    key={`${booking.id}-${index}`}
                    className="cursor-pointer rounded-2xl p-4 shadow-sm transition-all hover:shadow-md"
                    onClick={() =>
                      navigate(`/history/${booking.id}`, { state: { booking } })
                    }
                  >
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                          <User className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="truncate text-sm font-bold leading-5">
                                {booking.therapistName}
                              </h4>
                              <p className="truncate text-xs leading-5 text-muted-foreground">
                                {booking.therapistSpecialty}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-sm font-bold leading-5">
                                Rp {booking.amount.toLocaleString("id-ID")}
                              </p>
                              <p className="font-mono text-[11px] leading-5 text-muted-foreground">
                                {booking.id}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div className="flex min-w-0 items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{booking.location}</span>
                            </div>
                            <div className="flex min-w-0 items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{booking.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <StatusBadge
                          status={booking.status}
                          label={booking.statusLabel}
                        />
                        {booking.paymentLabel && (
                          <PaymentStatusBadge
                            status={booking.paymentStatus}
                            label={booking.paymentLabel}
                          />
                        )}
                      </div>

                      {needsPaymentBeforeVisit(
                        booking.status,
                        booking.paymentStatus,
                      ) && <PaymentBeforeVisitNotice />}

                      <div
                        className="flex gap-2 border-t border-border/60 pt-3"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {isChatVisible(booking.status) &&
                          (isChatEnabled(booking.status) ? (
                            <Button
                              size="sm"
                              className="min-w-0 flex-1 rounded-full bg-primary font-medium text-foreground shadow-sm hover:bg-primary/90 hover:shadow-md"
                              asChild
                            >
                              <Link to="/chat">
                                <MessageSquare className="mr-1.5 h-4 w-4" />
                                Chat
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              disabled
                              className="min-w-0 flex-1 rounded-full bg-primary font-medium text-foreground"
                            >
                              <MessageSquare className="mr-1.5 h-4 w-4" />
                              Chat
                            </Button>
                          ))}
                        <Button
                          size="sm"
                          variant="outline"
                          className="min-w-0 flex-1 rounded-full bg-transparent font-medium"
                          onClick={() =>
                            navigate(`/history/${booking.id}`, {
                              state: { booking },
                            })
                          }
                        >
                          Detail
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                        {booking.canBookAgain && (
                          <Button
                            size="sm"
                            className="min-w-0 flex-1 rounded-full bg-primary font-medium text-foreground hover:bg-primary/90"
                            asChild
                          >
                            <Link to="/booking">Book Lagi</Link>
                          </Button>
                        )}
                        {booking.canInvoice && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="min-w-0 flex-1 rounded-full bg-transparent font-medium"
                          >
                            <Download className="mr-1.5 h-4 w-4" />
                            Invoice
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                {isLoadingMore && (
                  <p className="py-2 text-center text-sm text-muted-foreground">
                    Memuat lainnya...
                  </p>
                )}
                {error && items.length > 0 && (
                  <div className="py-2 text-center">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-3 rounded-full"
                      onClick={loadMore}
                    >
                      Coba lagi
                    </Button>
                  </div>
                )}
                <div ref={sentinelRef} className="h-1" />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
