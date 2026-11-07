import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Home } from "lucide-react";

function formatRupiah(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "–";
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function maskAccount(value) {
  const digits = String(value || "");
  if (digits.length <= 4) return digits;
  return `${"•".repeat(Math.max(digits.length - 4, 4))} ${digits.slice(-4)}`;
}

export default function PaymentSuccessPage() {
  const location = useLocation();
  const booking = location.state?.booking || null;
  const payment = location.state?.payment || null;
  const detailPath =
    booking?.id && booking.id !== "-" ? `/history/${booking.id}` : "/history";

  return (
    <div className="min-h-screen bg-background">
      <main className="px-4 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-accent shadow-lg">
            <CheckCircle2 className="h-14 w-14 text-foreground" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Bukti transfer terkirim</h2>
          <p className="text-sm text-muted-foreground">
            Pembayaran menunggu konfirmasi dari admin
          </p>
        </div>

        <Card className="mb-4 gap-3 rounded-2xl border-0 bg-primary-soft p-6 text-center shadow-sm">
          <p className="text-xs text-muted-foreground">Kode order</p>
          <p className="text-2xl font-bold tracking-wide">{booking?.id || "–"}</p>
        </Card>

        <Card className="mb-8 gap-3 rounded-2xl border-0 p-6 shadow-sm">
          <h3 className="font-semibold">Ringkasan transfer</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Bank</span>
              <span className="font-semibold">{payment?.bankName || "–"}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Nomor rekening</span>
              <span className="font-semibold">
                {payment?.accountNumber ? maskAccount(payment.accountNumber) : "–"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Pemilik rekening</span>
              <span className="text-right font-semibold">
                {payment?.accountName || "–"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Bukti</span>
              <span className="max-w-[60%] truncate text-right font-semibold">
                {payment?.proofName || "–"}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="font-medium">Total</span>
              <span className="text-2xl font-bold">
                {formatRupiah(booking?.amount)}
              </span>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Button
            size="lg"
            className="h-12 w-full rounded-full bg-primary text-base font-semibold text-foreground hover:bg-primary/90"
            asChild
          >
            <Link to={detailPath}>Lihat detail order</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 w-full rounded-full border-2 bg-transparent text-base font-semibold"
            asChild
          >
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Kembali ke Home
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
