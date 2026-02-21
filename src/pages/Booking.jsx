import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  MapPin,
  CalendarIcon,
  Clock,
  User,
  Star,
  ChevronRight,
} from "lucide-react";

const cities = [
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Medan",
  "Semarang",
  "Makassar",
  "Palembang",
  "Tangerang",
  "Depok",
  "Bekasi",
  "Bogor",
  "Yogyakarta",
  "Malang",
  "Solo",
  "Denpasar",
];

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const therapists = [
  {
    id: 1,
    name: "Dr. Ahmad Wijaya, S.Ft",
    specialty: "Sports Physiotherapy",
    experience: "8 tahun",
    rating: "4.9",
  },
  {
    id: 2,
    name: "Dr. Siti Nurhaliza, S.Ft",
    specialty: "Orthopedic Physiotherapy",
    experience: "6 tahun",
    rating: "4.8",
  },
  {
    id: 3,
    name: "Dr. Budi Santoso, S.Ft",
    specialty: "Neurological Physiotherapy",
    experience: "10 tahun",
    rating: "4.9",
  },
];

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTherapist, setSelectedTherapist] = useState(null);

  const canProceedStep1 = selectedCity;
  const canProceedStep2 = selectedDate && selectedTime;
  const canProceedStep3 = selectedTherapist !== null;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={currentStep === 1 ? undefined : handleBack}
                asChild={currentStep === 1}
              >
                {currentStep === 1 ? (
                  <Link to="/">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                ) : (
                  <ArrowLeft className="h-5 w-5" />
                )}
              </Button>
              <div>
                <h1 className="text-lg font-bold">Booking</h1>
                <p className="text-xs text-muted-foreground">
                  Step {currentStep} dari 4
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-full transition-all ${
                  step <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MapPin className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Pilih Lokasi</h2>
              <p className="text-sm text-muted-foreground">
                Dimana lokasi sesi terapi Anda?
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Kota atau Kabupaten</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-14 rounded-xl border-border">
                  <SelectValue placeholder="Pilih kota" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                className="h-14 w-full rounded-full bg-gradient-to-r from-primary to-accent font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                disabled={!canProceedStep1}
                onClick={handleNext}
              >
                Lanjut
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Pilih Tanggal</h2>
              <p className="text-sm text-muted-foreground">
                Kapan Anda ingin melakukan sesi?
              </p>
            </div>

            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="w-full rounded-xl border border-border"
              />
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                className="h-14 w-full rounded-full bg-gradient-to-r from-primary to-accent font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                disabled={!selectedDate}
                onClick={handleNext}
              >
                Lanjut
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-chart-2 text-white">
                <Clock className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Pilih Waktu</h2>
              <p className="text-sm text-muted-foreground">
                Jam berapa yang sesuai untuk Anda?
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={`h-14 rounded-xl text-base ${
                    selectedTime === time
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                className="h-14 w-full rounded-full bg-gradient-to-r from-primary to-accent font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                disabled={!canProceedStep2}
                onClick={handleNext}
              >
                Lanjut
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-chart-3 text-white">
                <User className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Pilih Terapis</h2>
              <p className="text-sm text-muted-foreground">
                Terapis tersedia di {selectedCity}
              </p>
            </div>

            <div className="space-y-3">
              {therapists.map((therapist) => (
                <button
                  key={therapist.id}
                  onClick={() => setSelectedTherapist(therapist.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    selectedTherapist === therapist.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      <User className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{therapist.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {therapist.specialty}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {therapist.experience}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-chart-3" />
                          {therapist.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Summary */}
            <Card className="rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold">Ringkasan Booking</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Lokasi</span>
                  <span className="font-semibold">{selectedCity}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tanggal</span>
                  <span className="font-semibold">
                    {selectedDate?.toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Waktu</span>
                  <span className="font-semibold">{selectedTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Terapis</span>
                  <span className="font-semibold">
                    {selectedTherapist
                      ? therapists
                          .find((t) => t.id === selectedTherapist)
                          ?.name.split(",")[0]
                      : "-"}
                  </span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-2xl font-bold">Rp 150.000</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="pt-4">
              {canProceedStep3 ? (
                <Button
                  size="lg"
                  className="h-14 w-full rounded-full bg-gradient-to-r from-primary to-accent font-semibold shadow-lg hover:shadow-xl"
                  asChild
                >
                  <Link to="/payment">
                    Lanjut Pembayaran
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="h-14 w-full rounded-full bg-gradient-to-r from-primary to-accent font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                  disabled
                >
                  Pilih Terapis
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
