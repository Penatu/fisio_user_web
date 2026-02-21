import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  MessageSquare,
  Download,
  ChevronRight,
} from "lucide-react";

const bookings = [
  {
    id: "PHYS-2025-001",
    therapistName: "Dr. Siti Nurhaliza, S.Ft",
    therapistSpecialty: "Orthopedic Physiotherapy",
    location: "Jakarta",
    date: "15 Des 2025",
    time: "14:00 - 15:00",
    status: "upcoming",
    amount: 155000,
    paymentStatus: "paid",
  },
  {
    id: "PHYS-2024-045",
    therapistName: "Dr. Ahmad Wijaya, S.Ft",
    therapistSpecialty: "Sports Physiotherapy",
    location: "Bandung",
    date: "10 Des 2024",
    time: "10:00 - 11:00",
    status: "completed",
    amount: 155000,
    paymentStatus: "paid",
  },
  {
    id: "PHYS-2024-032",
    therapistName: "Dr. Budi Santoso, S.Ft",
    therapistSpecialty: "Neurological Physiotherapy",
    location: "Jakarta",
    date: "05 Des 2024",
    time: "15:00 - 16:00",
    status: "completed",
    amount: 155000,
    paymentStatus: "paid",
  },
  {
    id: "PHYS-2024-021",
    therapistName: "Dr. Siti Nurhaliza, S.Ft",
    therapistSpecialty: "Orthopedic Physiotherapy",
    location: "Surabaya",
    date: "28 Nov 2024",
    time: "09:00 - 10:00",
    status: "cancelled",
    amount: 155000,
    paymentStatus: "refunded",
  },
];

function StatusBadge({ status }) {
  const styles = {
    upcoming: "bg-primary/10 text-primary border-primary/20",
    completed: "bg-accent/10 text-accent border-accent/20",
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
    paid: "bg-accent/10 text-accent border-accent/20",
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

export default function HistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") return booking.status === "upcoming";
    if (activeTab === "completed") return booking.status === "completed";
    if (activeTab === "cancelled") return booking.status === "cancelled";
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-lg">
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
            <p className="mb-1 text-2xl font-bold">{bookings.length}</p>
            <p className="text-xs text-muted-foreground">Total Booking</p>
          </Card>
          <Card className="rounded-2xl p-4 shadow-sm">
            <p className="mb-1 text-2xl font-bold">
              {bookings.filter((b) => b.status === "completed").length}
            </p>
            <p className="text-xs text-muted-foreground">Selesai</p>
          </Card>
          <Card className="rounded-2xl p-4 shadow-sm">
            <p className="mb-1 text-2xl font-bold">
              {bookings.filter((b) => b.status === "upcoming").length}
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
            {filteredBookings.length === 0 ? (
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
                {filteredBookings.map((booking) => (
                  <Card
                    key={booking.id}
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
                            <StatusBadge status={booking.status} />
                            <PaymentStatusBadge
                              status={booking.paymentStatus}
                            />
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
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
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.time}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div
                        className="flex flex-wrap gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {booking.status === "upcoming" && (
                          <>
                            <Button
                              size="sm"
                              className="rounded-full bg-gradient-to-r from-primary to-accent font-medium shadow-sm hover:shadow-md"
                              asChild
                            >
                              <Link to="/chat">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Chat
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full font-medium bg-transparent"
                            >
                              Reschedule
                            </Button>
                          </>
                        )}
                        {booking.status === "completed" && (
                          <>
                            <Button
                              size="sm"
                              className="rounded-full bg-gradient-to-r from-primary to-accent font-medium"
                              asChild
                            >
                              <Link to="/booking">
                                Book Lagi
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full font-medium bg-transparent"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Invoice
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
