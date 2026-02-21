import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, Wallet, Building2, MapPin, CalendarIcon, Clock, User } from "lucide-react";

const bankOptions = [
  { id: "bca", name: "BCA", logo: "💳" },
  { id: "mandiri", name: "Mandiri", logo: "💳" },
  { id: "bni", name: "BNI", logo: "💳" },
  { id: "bri", name: "BRI", logo: "💳" },
];

const ewalletOptions = [
  { id: "gopay", name: "GoPay", logo: "🟢" },
  { id: "ovo", name: "OVO", logo: "🟣" },
  { id: "dana", name: "DANA", logo: "🔵" },
  { id: "shopeepay", name: "ShopeePay", logo: "🟠" },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("ewallet");
  const [selectedOption, setSelectedOption] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const bookingData = location.state?.bookingData || null;
  const bookingDate = bookingData?.date ? new Date(bookingData.date) : null;

  const handlePayment = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate("/payment/success", { state: { bookingData } });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pb-32">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-lg">
        <div className="flex items-center gap-4 px-4 py-4">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link to="/booking">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-bold">Pembayaran</h1>
        </div>
      </header>

      <main className="px-4 py-6 pb-24">
        {/* Order Summary Card */}
        <Card className="mb-4 overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-primary/10 to-accent/10 shadow-lg">
          <div className="p-6">
            <p className="mb-4 text-sm text-muted-foreground">
              Total Pembayaran
            </p>
            <p className="mb-6 text-4xl font-bold">Rp 155.000</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sesi Fisioterapi</span>
                <span className="font-semibold">Rp 150.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biaya Admin</span>
                <span className="font-semibold">Rp 5.000</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Booking Detail */}
        {bookingData && (
          <Card className="mb-6 overflow-hidden rounded-2xl border-0 shadow-lg">
            <div className="p-6">
              <h3 className="mb-4 text-sm font-semibold">Detail Booking</h3>
              <div className="space-y-3">
                {bookingData.city && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-1 items-center justify-between text-sm">
                      <span className="text-muted-foreground">Lokasi</span>
                      <span className="font-semibold">{bookingData.city}</span>
                    </div>
                  </div>
                )}
                {bookingDate && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-1 items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tanggal</span>
                      <span className="font-semibold">
                        {bookingDate.toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                )}
                {bookingData.time && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-1 items-center justify-between text-sm">
                      <span className="text-muted-foreground">Waktu</span>
                      <span className="font-semibold">{bookingData.time} WIB</span>
                    </div>
                  </div>
                )}
                {bookingData.therapist && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-1 items-center justify-between text-sm">
                      <span className="text-muted-foreground">Terapis</span>
                      <span className="font-semibold">
                        {bookingData.therapist.name.split(",")[0]}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Payment Method Title */}
        <h2 className="mb-4 text-lg font-bold">Pilih Metode Pembayaran</h2>

        {/* Payment Method Tabs */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <button
            onClick={() => setPaymentMethod("bank")}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
              paymentMethod === "bank"
                ? "border-primary bg-primary/10 shadow-lg"
                : "border-border bg-card hover:bg-secondary/50"
            }`}
          >
            <Building2
              className={`h-6 w-6 ${
                paymentMethod === "bank"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            />
            <span className="text-xs font-semibold">Bank</span>
          </button>
          <button
            onClick={() => setPaymentMethod("ewallet")}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
              paymentMethod === "ewallet"
                ? "border-primary bg-primary/10 shadow-lg"
                : "border-border bg-card hover:bg-secondary/50"
            }`}
          >
            <Wallet
              className={`h-6 w-6 ${
                paymentMethod === "ewallet"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            />
            <span className="text-xs font-semibold">E-Wallet</span>
          </button>
          <button
            onClick={() => setPaymentMethod("card")}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
              paymentMethod === "card"
                ? "border-primary bg-primary/10 shadow-lg"
                : "border-border bg-card hover:bg-secondary/50"
            }`}
          >
            <CreditCard
              className={`h-6 w-6 ${
                paymentMethod === "card"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            />
            <span className="text-xs font-semibold">Kartu</span>
          </button>
        </div>

        {/* Payment Options */}
        <div className="space-y-3">
          {paymentMethod === "bank" && (
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
              className="space-y-3"
            >
              {bankOptions.map((bank) => (
                <label
                  key={bank.id}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 bg-card p-4 transition-all ${
                    selectedOption === bank.id
                      ? "border-primary shadow-lg"
                      : "border-border hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{bank.logo}</span>
                    <div>
                      <p className="font-semibold">{bank.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Virtual Account
                      </p>
                    </div>
                  </div>
                  <RadioGroupItem value={bank.id} id={bank.id} />
                </label>
              ))}
            </RadioGroup>
          )}

          {paymentMethod === "ewallet" && (
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
              className="space-y-3"
            >
              {ewalletOptions.map((ewallet) => (
                <label
                  key={ewallet.id}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 bg-card p-4 transition-all ${
                    selectedOption === ewallet.id
                      ? "border-primary shadow-lg"
                      : "border-border hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ewallet.logo}</span>
                    <p className="font-semibold">{ewallet.name}</p>
                  </div>
                  <RadioGroupItem value={ewallet.id} id={ewallet.id} />
                </label>
              ))}
            </RadioGroup>
          )}

          {paymentMethod === "card" && (
            <Card className="space-y-4 rounded-2xl border-0 bg-card p-4 shadow-lg">
              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Nomor Kartu
                </Label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  className="h-12 rounded-xl border-border bg-secondary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Expired
                  </Label>
                  <Input
                    placeholder="MM/YY"
                    className="h-12 rounded-xl border-border bg-secondary/50"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium">CVV</Label>
                  <Input
                    placeholder="123"
                    type="password"
                    maxLength={3}
                    className="h-12 rounded-xl border-border bg-secondary/50"
                  />
                </div>
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Nama Pemegang Kartu
                </Label>
                <Input
                  placeholder="Nama sesuai kartu"
                  className="h-12 rounded-xl border-border bg-secondary/50 uppercase"
                />
              </div>
            </Card>
          )}
        </div>

        {/* Pay Button - Fixed at bottom */}
        <div className="fixed bottom-20 left-1/2 w-full max-w-[450px] -translate-x-1/2 bg-gradient-to-t from-background via-background to-transparent p-4">
          <Button
            size="lg"
            className="h-14 w-full rounded-full bg-gradient-to-r from-primary to-accent text-base font-semibold shadow-2xl hover:shadow-3xl disabled:opacity-50"
            disabled={
              isProcessing || (paymentMethod !== "card" && !selectedOption)
            }
            onClick={handlePayment}
          >
            {isProcessing ? "Memproses..." : "Bayar Sekarang"}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            🔒 Pembayaran aman dan terenkripsi
          </p>
        </div>
      </main>
    </div>
  );
}
