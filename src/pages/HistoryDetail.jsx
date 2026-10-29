import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Clock,
  Download,
  MessageSquare,
  CreditCard,
  Phone,
  Mail,
  FileText,
  Building2,
} from "lucide-react";

function StatusBadge({ status }) {
  const styles = {
    upcoming: "bg-primary-soft text-foreground border-transparent",
    completed: "bg-accent/40 text-foreground border-transparent",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const labels = {
    upcoming: "Akan Datang",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };

  return (
    <Badge className={`rounded-full border font-medium ${styles[status]}`}>
      {labels[status]}
    </Badge>
  );
}

function PaymentStatusBadge({ status }) {
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
    <Badge className={`rounded-full border font-medium ${styles[status]}`}>
      {labels[status]}
    </Badge>
  );
}

export default function HistoryDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  // Fallback data jika tidak ada state
  const defaultBooking = {
    id: "PHYS-2025-001",
    therapistName: "Dr. Siti Nurhaliza, S.Ft",
    therapistSpecialty: "Orthopedic Physiotherapy",
    therapistEmail: "siti.nurhaliza@physiobook.id",
    therapistPhone: "+62 812-3456-7890",
    location: "Jakarta",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    date: "15 Des 2025",
    fullDate: "Senin, 15 Desember 2025",
    time: "14:00 - 15:00",
    status: "upcoming",
    amount: 155000,
    serviceFee: 150000,
    adminFee: 5000,
    paymentStatus: "paid",
    paymentMethod: "GoPay",
    paymentDate: "14 Des 2025, 10:30 WIB",
    bookingDate: "10 Des 2025, 14:20 WIB",
  };

  const currentBooking = booking || defaultBooking;

  const handleDownloadInvoice = () => {
    // Simulate download
    console.log("Downloading invoice for", currentBooking.id);
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
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Detail Booking</h1>
              <p className="text-xs text-muted-foreground">Informasi lengkap transaksi</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {/* Booking ID & Status */}
          <Card className="rounded-2xl border-0 bg-primary-soft p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">ID Booking</p>
                <p className="text-2xl font-bold tracking-wide">{currentBooking.id}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={currentBooking.status} />
                <PaymentStatusBadge status={currentBooking.paymentStatus} />
              </div>
            </div>
            <div className="border-t border-border/50 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tanggal Booking</span>
                <span className="font-medium">{currentBooking.bookingDate}</span>
              </div>
            </div>
          </Card>

          {/* Therapist Information */}
          <Card className="rounded-2xl border-0 shadow-lg">
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Informasi Terapis</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-foreground">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold">{currentBooking.therapistName}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {currentBooking.therapistSpecialty}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {currentBooking.therapistEmail || "siti.nurhaliza@physiobook.id"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {currentBooking.therapistPhone || "+62 812-3456-7890"}
                        </span>
                      </div>
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
                    <p className="text-xs text-muted-foreground">Tanggal & Waktu</p>
                    <p className="font-semibold">{currentBooking.fullDate || currentBooking.date}</p>
                    <p className="text-sm text-muted-foreground">{currentBooking.time} WIB</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <MapPin className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Lokasi</p>
                    <p className="font-semibold">{currentBooking.location}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentBooking.address || "Alamat akan dikirim via email"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Clock className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Durasi</p>
                    <p className="font-semibold">60 menit</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Information */}
          <Card className="rounded-2xl border-0 shadow-lg">
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Informasi Pembayaran</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <CreditCard className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Metode Pembayaran</p>
                    <p className="font-semibold">
                      {currentBooking.paymentMethod || "E-Wallet (GoPay)"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {currentBooking.paymentDate || "14 Des 2025, 10:30 WIB"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sesi Fisioterapi</span>
                    <span className="font-semibold">
                      Rp {currentBooking.serviceFee?.toLocaleString("id-ID") || "150.000"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Biaya Admin</span>
                    <span className="font-semibold">
                      Rp {currentBooking.adminFee?.toLocaleString("id-ID") || "5.000"}
                    </span>
                  </div>
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
            {currentBooking.status === "upcoming" && (
              <>
                <Button
                  size="lg"
                  className="h-12 w-full rounded-full bg-primary text-foreground hover:bg-primary/90 font-semibold shadow-lg"
                  asChild
                >
                  <Link to="/chat">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Chat dengan Terapis
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full rounded-full border-2 font-semibold bg-transparent"
                >
                  Reschedule Booking
                </Button>
              </>
            )}

            {currentBooking.status === "completed" && (
              <>
                <Button
                  size="lg"
                  className="h-12 w-full rounded-full bg-primary text-foreground hover:bg-primary/90 font-semibold shadow-lg"
                  asChild
                >
                  <Link to="/booking">
                    Book Lagi dengan Terapis Ini
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full rounded-full border-2 font-semibold bg-transparent"
                  onClick={handleDownloadInvoice}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Invoice
                </Button>
              </>
            )}

            {currentBooking.status === "cancelled" && (
              <Button
                size="lg"
                className="h-12 w-full rounded-full bg-primary text-foreground hover:bg-primary/90 font-semibold shadow-lg"
                asChild
              >
                <Link to="/booking">
                  Buat Booking Baru
                </Link>
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-full border-2 font-semibold bg-transparent"
              onClick={handleDownloadInvoice}
            >
              <FileText className="mr-2 h-5 w-5" />
              Download Detail Booking
            </Button>
          </div>

          {/* Additional Info */}
          <Card className="rounded-2xl border-0 bg-muted/30 p-6">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Perlu Bantuan?</p>
                <p className="text-xs text-muted-foreground">
                  Hubungi customer service kami jika Anda memiliki pertanyaan tentang booking ini.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
