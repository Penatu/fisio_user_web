import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  Clock,
  Home,
} from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="px-4 py-12 pb-24">
        {/* Success Icon */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-accent shadow-2xl">
            <CheckCircle2 className="h-14 w-14 text-foreground" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Pembayaran Berhasil!</h2>
          <p className="text-sm text-muted-foreground">
            Booking Anda telah dikonfirmasi
          </p>
        </div>

        {/* Booking ID Card */}
        <Card className="mb-4 overflow-hidden rounded-2xl border-0 bg-primary-soft shadow-lg">
          <div className="p-6 text-center">
            <p className="mb-2 text-xs text-muted-foreground">ID Booking</p>
            <p className="text-2xl font-bold tracking-wide">PHYS-2025-001</p>
          </div>
        </Card>

        {/* Detail Booking */}
        <Card className="mb-4 overflow-hidden rounded-2xl border-0 shadow-lg">
          <div className="p-6">
            <h3 className="mb-4 font-semibold">Detail Booking</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Terapis</p>
                  <p className="font-semibold">Dr. Siti Nurhaliza, S.Ft</p>
                  <p className="text-xs text-muted-foreground">
                    Orthopedic Physiotherapy
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Lokasi</p>
                  <p className="font-semibold">Jakarta</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Tanggal</p>
                  <p className="font-semibold">Senin, 15 Desember 2025</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Waktu</p>
                  <p className="font-semibold">14:00 - 15:00 WIB</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Summary */}
        <Card className="mb-8 overflow-hidden rounded-2xl border-0 shadow-lg">
          <div className="p-6">
            <h3 className="mb-4 font-semibold">Ringkasan Pembayaran</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Lunas
                </span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Pembayaran</span>
                  <span className="text-2xl font-bold">Rp 155.000</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="h-14 w-full rounded-full bg-primary text-foreground hover:bg-primary/90 text-base font-semibold shadow-lg"
            asChild
          >
            <Link to="/chat">Chat dengan Terapis</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 w-full rounded-full border-2 text-base font-semibold bg-transparent"
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
