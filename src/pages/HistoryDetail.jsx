import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTransactionDetail } from "@/hooks/useTransactionDetail";
import { useCancelReservation } from "@/hooks/useCancelReservation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Clock,
  Download,
  MessageSquare,
  CreditCard,
  Upload,
  Phone,
  Mail,
  Building2,
  Check,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";

function StatusBadge({ status, label }) {
  const styles = {
    new: "bg-secondary text-foreground border-transparent",
    confirmed: "bg-primary-soft text-foreground border-transparent",
    processing: "bg-primary/15 text-foreground border-transparent",
    in_progress: "bg-primary/15 text-foreground border-transparent",
    finished: "bg-accent/40 text-foreground border-transparent",
    canceled: "bg-destructive/10 text-destructive border-destructive/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const labels = {
    new: "Pesanan baru",
    confirmed: "Dikonfirmasi",
    visit: "Proses Kunjungan",
    in_progress: "Proses Kunjungan",
    finished: "Selesai",
    cancelled: "Dibatalkan",
    canceled: "Dibatalkan",
  };

  return (
    <Badge
      className={`rounded-full border font-medium ${styles[status] || "bg-muted text-foreground border-border"}`}
    >
      {label || labels[status] || status}
    </Badge>
  );
}

const ORDER_FLOW = [
  { key: "new", label: "Pesanan baru" },
  { key: "confirmed", label: "Dikonfirmasi" },
  { key: "visit", label: "Proses Kunjungan" },
  { key: "finished", label: "Selesai" },
];

function normalizeOrderStatus(status) {
  const value = String(status || "").toLowerCase();
  if (value === "in_progress" || value === "inprogress") return "visit";
  if (value === "cancelled") return "canceled";
  return value;
}

function needsPaymentBeforeVisit(status, paymentStatus) {
  const order = normalizeOrderStatus(status);
  const payment = String(paymentStatus || "").toLowerCase();
  const isPaid = payment === "paid" || payment === "lunas";
  return order === "visit" && !isPaid;
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

function OrderStatusTrack({ status }) {
  const resolved = normalizeOrderStatus(status);
  const cancelled = resolved === "canceled";
  const currentIndex = ORDER_FLOW.findIndex((step) => step.key === resolved);

  return (
    <Card className="rounded-2xl border-0 p-5 shadow-lg">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Status pesanan
      </p>
      <ol className="grid grid-cols-4">
        {ORDER_FLOW.map((step, index) => {
          const reached = !cancelled && currentIndex >= index;
          const current = !cancelled && currentIndex === index;
          const done = reached && !current;

          return (
            <li
              key={step.key}
              className="relative flex flex-col items-center px-1 text-center"
              aria-current={current ? "step" : undefined}
            >
              {index < ORDER_FLOW.length - 1 && (
                <span
                  aria-hidden
                  className={`absolute top-3 left-1/2 h-0.5 w-full -translate-y-1/2 ${
                    !cancelled && currentIndex > index
                      ? "bg-primary"
                      : "bg-border"
                  }`}
                />
              )}
              <span
                className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                  current
                    ? "bg-primary text-foreground ring-4 ring-primary/25"
                    : done
                      ? "bg-primary text-foreground"
                      : "bg-secondary text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span
                className={`mt-2 text-[11px] leading-tight ${
                  current
                    ? "font-semibold text-foreground"
                    : "font-medium text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
      {cancelled && (
        <p className="mt-4 text-center text-sm font-medium text-destructive">
          Pesanan ini dibatalkan
        </p>
      )}
    </Card>
  );
}

function PaymentStatusBadge({ status, label }) {
  const styles = {
    paid: "bg-accent/40 text-foreground border-transparent",
    pending: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    refunded: "bg-muted text-muted-foreground border-border",
  };

  const labels = {
    paid: "Lunas",
    pending: "Pending",
    refunded: "Refund",
  };

  return (
    <Badge
      className={`rounded-full border font-medium ${styles[status] || "bg-muted text-foreground border-border"}`}
    >
      {label || labels[status] || status}
    </Badge>
  );
}

const CANCELLABLE_STATUSES = ["new", "confirmed", "processing", "in_progress"];

export default function HistoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    booking: currentBooking,
    isLoading,
    error,
    reload,
  } = useTransactionDetail(id);
  const {
    mutate: cancelReservation,
    isLoading: isCancelling,
    error: cancelError,
    clearError: clearCancelError,
  } = useCancelReservation();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleDownloadInvoice = () => {
    // Simulate download
    console.log("Downloading invoice for", currentBooking.id);
  };

  const paymentStatus = String(
    currentBooking?.paymentStatus || "",
  ).toLowerCase();
  const orderStatus = String(currentBooking?.status || "").toLowerCase();
  const canPay =
    Boolean(currentBooking) &&
    !["paid", "lunas", "refunded"].includes(paymentStatus) &&
    !["cancelled", "canceled"].includes(orderStatus);
  const canCancel =
    Boolean(currentBooking) &&
    (typeof currentBooking.canCancel === "boolean"
      ? currentBooking.canCancel
      : CANCELLABLE_STATUSES.includes(orderStatus));

  const handleCancel = async () => {
    const result = await cancelReservation(currentBooking.id, cancelReason);
    if (!result.success) return;
    setConfirmCancel(false);
    setCancelReason("");
    reload();
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              asChild
            >
              <Link to="/history">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-bold">Detail Booking</h1>
              <p className="text-xs text-muted-foreground">
                Informasi lengkap transaksi
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        {isLoading && (
          <Card className="rounded-2xl p-12 text-center shadow-sm">
            <p className="text-sm text-muted-foreground">
              Memuat detail transaksi...
            </p>
          </Card>
        )}
        {!isLoading && error && (
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
        )}
        {!isLoading && currentBooking && (
          <div className="mx-auto max-w-2xl space-y-4">
            {needsPaymentBeforeVisit(
              currentBooking.status,
              currentBooking.paymentStatus,
            ) && <PaymentBeforeVisitNotice />}

            <OrderStatusTrack status={currentBooking.status} />

            {/* Booking ID & Status */}
            <Card className="rounded-2xl border-0 bg-primary-soft p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    ID Booking
                  </p>
                  <p className="text-2xl font-bold tracking-wide">
                    {currentBooking.id}
                  </p>
                  {currentBooking.refNumber && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {currentBooking.refNumber}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge
                    status={currentBooking.status}
                    label={currentBooking.statusLabel}
                  />
                  {(currentBooking.paymentLabel ||
                    currentBooking.paymentStatus) && (
                    <PaymentStatusBadge
                      status={currentBooking.paymentStatus}
                      label={currentBooking.paymentLabel}
                    />
                  )}
                </div>
              </div>
              <div className="border-t border-border/50 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tanggal Booking</span>
                  <span className="font-medium">
                    {currentBooking.bookingDate}
                  </span>
                </div>
              </div>
            </Card>

            {/* Therapist Information */}
            <Card className="rounded-2xl border-0 shadow-lg">
              <div className="p-6">
                <h3 className="mb-4 text-lg font-semibold">
                  Informasi Terapis
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-foreground">
                      <User className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold">
                        {currentBooking.therapistName}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {currentBooking.therapistSpecialty}
                      </p>
                      <div className="space-y-2">
                        {currentBooking.therapistEmail && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {currentBooking.therapistEmail}
                            </span>
                          </div>
                        )}
                        {currentBooking.therapistPhone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {currentBooking.therapistPhone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Booking Details */}
            <Card className="rounded-2xl border-0 shadow-lg">
              <div className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Detail Sesi</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Calendar className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        Tanggal & Waktu
                      </p>
                      <p className="font-semibold">
                        {currentBooking.fullDate || currentBooking.date}
                      </p>
                      {currentBooking.time && (
                        <p className="text-sm text-muted-foreground">
                          {currentBooking.time} WIB
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <MapPin className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Lokasi</p>
                      <p className="font-semibold">{currentBooking.location}</p>
                      {currentBooking.address && (
                        <p className="text-sm text-muted-foreground">
                          {currentBooking.address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Clock className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Durasi</p>
                      <p className="font-semibold">
                        {currentBooking.duration || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Information */}
            <Card className="rounded-2xl border-0 shadow-lg">
              <div className="p-6">
                <h3 className="mb-4 text-lg font-semibold">
                  Informasi Pembayaran
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <CreditCard className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        Metode Pembayaran
                      </p>
                      <p className="font-semibold">
                        {currentBooking.paymentMethod ||
                          currentBooking.paymentLabel ||
                          "-"}
                      </p>
                      {currentBooking.paymentDate && (
                        <p className="text-sm text-muted-foreground">
                          {currentBooking.paymentDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    {currentBooking.serviceFee != null && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Sesi Fisioterapi
                        </span>
                        <span className="font-semibold">
                          Rp{" "}
                          {Number(currentBooking.serviceFee).toLocaleString(
                            "id-ID",
                          )}
                        </span>
                      </div>
                    )}
                    {currentBooking.adminFee != null && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Biaya Admin
                        </span>
                        <span className="font-semibold">
                          Rp{" "}
                          {Number(currentBooking.adminFee).toLocaleString(
                            "id-ID",
                          )}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-border pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Total Pembayaran</span>
                        <span className="text-2xl font-bold">
                          Rp {currentBooking.amount.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              {canPay && (
                <Button
                  size="lg"
                  className="h-12 w-full rounded-full bg-primary font-semibold text-foreground shadow-lg hover:bg-primary/90"
                  onClick={() =>
                    navigate("/payment", { state: { booking: currentBooking } })
                  }
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Bayar dengan transfer
                </Button>
              )}
              {!["finished", "canceled"].includes(
                normalizeOrderStatus(currentBooking.status),
              ) &&
                (["confirmed", "visit", "processing"].includes(
                  normalizeOrderStatus(currentBooking.status),
                ) ? (
                  <Button
                    size="lg"
                    className="h-12 w-full rounded-full bg-primary font-semibold text-foreground shadow-lg hover:bg-primary/90"
                    asChild
                  >
                    <Link to={`/chat/${encodeURIComponent(currentBooking.id)}`}>
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Chat dengan Terapis
                    </Link>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    disabled
                    className="h-12 w-full rounded-full bg-primary font-semibold text-foreground"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Chat dengan Terapis
                  </Button>
                ))}
              {(currentBooking.canBookAgain ??
                currentBooking.status === "finished") && (
                <Button
                  size="lg"
                  className="h-12 w-full rounded-full bg-primary text-foreground hover:bg-primary/90 font-semibold shadow-lg"
                  asChild
                >
                  <Link to="/booking">Book Lagi dengan Terapis Ini</Link>
                </Button>
              )}
              {(currentBooking.canInvoice ??
                currentBooking.status === "finished") && (
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full rounded-full border-2 font-semibold bg-transparent"
                  onClick={handleDownloadInvoice}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Invoice
                </Button>
              )}

              {canCancel &&
                (confirmCancel ? (
                  <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm font-semibold">
                      Batalkan pesanan ini?
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Pesanan yang dibatalkan tidak dapat dilanjutkan.
                    </p>
                    <label
                      htmlFor="cancel-reason"
                      className="mt-3 block text-sm font-medium"
                    >
                      Alasan
                    </label>
                    <textarea
                      id="cancel-reason"
                      value={cancelReason}
                      onChange={(event) => {
                        clearCancelError();
                        setCancelReason(event.target.value);
                      }}
                      placeholder="Tuliskan alasan pembatalan"
                      rows={3}
                      className="mt-2 w-full resize-none rounded-2xl border-0 bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    {cancelError && (
                      <p className="mt-2 text-sm text-destructive">
                        {cancelError}
                      </p>
                    )}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full bg-transparent font-semibold"
                        disabled={isCancelling}
                        onClick={() => {
                          clearCancelError();
                          setConfirmCancel(false);
                          setCancelReason("");
                        }}
                      >
                        Tidak
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        className="h-11 rounded-full font-semibold"
                        disabled={isCancelling || !cancelReason.trim()}
                        onClick={handleCancel}
                      >
                        {isCancelling ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <X className="mr-2 h-4 w-4" />
                        )}
                        {isCancelling ? "Membatalkan..." : "Ya, batalkan"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-full rounded-full border-destructive/40 bg-transparent font-semibold text-destructive hover:border-destructive hover:bg-destructive/5"
                    onClick={() => {
                      clearCancelError();
                      setConfirmCancel(true);
                    }}
                  >
                    <X className="mr-2 h-5 w-5" />
                    Batalkan pesanan
                  </Button>
                ))}

              {["cancelled", "canceled"].includes(currentBooking.status) && (
                <Button
                  size="lg"
                  className="h-12 w-full rounded-full bg-primary text-foreground hover:bg-primary/90 font-semibold shadow-lg"
                  asChild
                >
                  <Link to="/booking">Buat Booking Baru</Link>
                </Button>
              )}
            </div>

            {/* Additional Info */}
            <Card className="rounded-2xl border-0 bg-muted/30 p-6">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Perlu Bantuan?</p>
                  <p className="text-xs text-muted-foreground">
                    Hubungi customer service kami jika Anda memiliki pertanyaan
                    tentang booking ini.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
