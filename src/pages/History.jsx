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
  Clock,
} from "lucide-react";

const STATUS_BY_TAB = {
  all: "",
  upcoming: "upcoming",
  completed: "completed",
  cancelled: "canceled",
};

function StatusBadge({ status, label }) {
  const styles = {
    new: "bg-primary-soft text-foreground border-transparent",
    upcoming: "bg-primary-soft text-foreground border-transparent",
    completed: "bg-accent/40 text-foreground border-transparent",
    canceled: "bg-destructive/10 text-destructive border-destructive/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
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
  } = useTransactionHistory(STATUS_BY_TAB[activeTab]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "240px" }
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
            <p className="mb-1 text-2xl font-bold">{summary?.totalBooking ?? "–"}</p>
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
          <TabsList className="grid w-full grid-cols-4 rounded-full bg-secondary/50 p-1">
            <TabsTrigger
              value="all"
              className="rounded-full text-xs font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              Semua
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="rounded-full text-xs font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              Akan Datang
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="rounded-full text-xs font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              Selesai
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="rounded-full text-xs font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              Dibatalkan
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading && items.length === 0 ? (
              <Card className="rounded-2xl p-12 text-center shadow-sm">
                <p className="text-sm text-muted-foreground">Memuat riwayat...</p>
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
                    className="cursor-pointer rounded-2xl p-5 shadow-sm transition-all hover:shadow-md"
                    onClick={() =>
                      navigate(`/history/${booking.id}`, { state: { booking } })
                    }
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">
                              {booking.id}
                            </span>
                            {booking.refNumber && (
                              <span className="text-xs text-muted-foreground">
                                {booking.refNumber}
                              </span>
                            )}
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
                          <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-foreground">
                              <User className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div>
                              <h4 className="font-bold">
                                {booking.therapistName}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {booking.therapistSpecialty}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Total</p>
                          <p className="text-lg font-bold">
                            Rp {booking.amount.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.date}</span>
                        </div>
                        {booking.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.time}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {(booking.canChat ||
                        booking.canReschedule ||
                        booking.canBookAgain ||
                        booking.canInvoice) && (
                        <div
                          className="flex flex-wrap gap-2"
                          onClick={(event) => event.stopPropagation()}
                        >
                          {booking.canChat && (
                            <Button
                              size="sm"
                              className="rounded-full bg-primary text-foreground hover:bg-primary/90 font-medium shadow-sm hover:shadow-md"
                              asChild
                            >
                              <Link to="/chat">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Chat
                              </Link>
                            </Button>
                          )}
                          {booking.canReschedule && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full font-medium bg-transparent"
                            >
                              Reschedule
                            </Button>
                          )}
                          {booking.canBookAgain && (
                            <Button
                              size="sm"
                              className="rounded-full bg-primary text-foreground hover:bg-primary/90 font-medium"
                              asChild
                            >
                              <Link to="/booking">
                                Book Lagi
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          {booking.canInvoice && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full font-medium bg-transparent"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Invoice
                            </Button>
                          )}
                        </div>
                      )}
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
