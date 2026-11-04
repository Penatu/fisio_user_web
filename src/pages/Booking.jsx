import { useState, useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useCities } from "@/hooks/useCities";
import { useTherapists } from "@/hooks/useTherapists";
import {
  PENDING_BOOKING_KEY,
  buildReservationPayload,
  useCreateReservation,
} from "@/hooks/useCreateReservation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  MapPin,
  CalendarIcon,
  Clock,
  User,
  Star,
  ChevronRight,
  ChevronDown,
  Search,
  X,
} from "lucide-react";

const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function getTomorrow() {
  const tomorrow = startOfDay(new Date());
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

function formatDateParam(date) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateParam(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function upcomingDays(count = 14) {
  const today = startOfDay(new Date());
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return date;
  });
}

function CityStrip({ cities, selectedId, onSelect, isLoading, error }) {
  const [query, setQuery] = useState("");
  const filtered = cities.filter((city) =>
    city.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari kota..."
          disabled={isLoading}
          className="h-12 w-full rounded-full border-0 bg-muted pr-4 pl-11 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60"
        />
      </div>

      {isLoading && (
        <p className="px-1 text-sm text-muted-foreground">Memuat kota...</p>
      )}
      {!isLoading && error && (
        <p className="px-1 text-sm text-destructive">{error}</p>
      )}
      {!isLoading && !error && cities.length === 0 && (
        <p className="px-1 text-sm text-muted-foreground">
          Kota tidak tersedia.
        </p>
      )}
      {!isLoading && !error && cities.length > 0 && filtered.length === 0 && (
        <p className="px-1 text-sm text-muted-foreground">
          Kota tidak ditemukan.
        </p>
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <div className="grid grid-flow-col grid-rows-2 items-center justify-start gap-2.5 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filtered.map((city) => {
            const active = String(city.id) === String(selectedId);
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => onSelect(city)}
                className={`flex w-[5.5rem] flex-col items-center justify-center rounded-[22px] px-2 text-center transition-all ${
                  active
                    ? "h-[92px] bg-primary text-foreground shadow-[0_12px_24px_-10px_rgba(73,203,235,0.95)]"
                    : "h-[76px] bg-muted text-foreground"
                }`}
              >
                <span className="line-clamp-2 text-sm font-bold leading-tight">
                  {city.name}
                </span>
                <span
                  className={`mt-2 h-1.5 w-1.5 rounded-full ${
                    active ? "bg-foreground" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TherapistCard({ therapist, selected, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-[22px] border transition-all ${
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-background"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-foreground">
            <User className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold leading-tight">{therapist.name}</h4>
              <span className="shrink-0 text-xs font-semibold text-foreground">
                {therapist.price}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {therapist.field}
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {therapist.yearOnField} tahun
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current text-chart-3" />
                {therapist.rating}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 flex-1 rounded-full border-border bg-muted font-semibold shadow-none"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? "Sembunyikan" : "Detail"}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </Button>
          <Button
            type="button"
            className={`h-10 flex-1 rounded-full font-semibold shadow-none ${
              selected
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "bg-primary text-foreground hover:bg-primary/90"
            }`}
            onClick={() => onSelect(therapist.code)}
          >
            {selected ? "Terpilih" : "Pilih"}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-muted/40 px-4 py-4">
          <h5 className="text-sm font-semibold">Informasi Terapis</h5>
          <div className="mt-3 space-y-2.5 text-sm">
            <div className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground">Kode</span>
              <span className="font-medium">{therapist.code}</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground">Bidang</span>
              <span className="text-right font-medium">{therapist.field}</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground">Pengalaman</span>
              <span className="font-medium">{therapist.yearOnField} tahun</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground">Rating</span>
              <span className="font-medium">{therapist.rating}</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground">Harga sesi</span>
              <span className="font-medium">{therapist.price}</span>
            </div>
            <div className="pt-1">
              <p className="text-muted-foreground">Profil</p>
              <p className="mt-1 leading-relaxed text-foreground">
                {therapist.profile?.trim()
                  ? therapist.profile
                  : "Belum ada deskripsi profil untuk terapis ini."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReservationSheet({
  open,
  onClose,
  complaint,
  address,
  addressDetail,
  onComplaintChange,
  onAddressChange,
  onAddressDetailChange,
  onSubmit,
  isSubmitting,
  error,
}) {
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const canSubmit = complaint.trim() && address.trim() && addressDetail.trim();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;
    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Tutup"
        className="absolute inset-0 bg-foreground/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reservation-title"
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-background px-5 pt-3 pb-6 shadow-2xl sm:mx-4 sm:rounded-[28px]"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted sm:hidden" />
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 id="reservation-title" className="text-xl font-bold">
              Detail Reservasi
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Isi keluhan dan alamat sebelum membuat reservasi.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="complaint">Keluhan</Label>
            <textarea
              id="complaint"
              value={complaint}
              onChange={(event) => onComplaintChange(event.target.value)}
              placeholder="Ceritakan keluhan yang ingin ditangani"
              rows={3}
              className="w-full resize-none rounded-2xl border-0 bg-muted px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Input
              id="address"
              value={address}
              onChange={(event) => onAddressChange(event.target.value)}
              placeholder="Nama jalan, nomor, kelurahan"
              className="h-12 rounded-full border-0 bg-muted px-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address-detail">Detail Alamat</Label>
            <textarea
              id="address-detail"
              value={addressDetail}
              onChange={(event) => onAddressDetailChange(event.target.value)}
              placeholder="Patokan, lantai, atau catatan untuk terapis"
              rows={3}
              className="w-full resize-none rounded-2xl border-0 bg-muted px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            size="lg"
            disabled={!canSubmit || isSubmitting}
            className="h-14 w-full rounded-full bg-primary text-foreground hover:bg-primary/90 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isSubmitting ? "Membuat reservasi..." : "Buat Reservasi"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function DateStrip({ selected, onSelect }) {
  const days = upcomingDays();
  const today = startOfDay(new Date());

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {days.map((date) => {
        const active = isSameDay(date, selected);
        const disabled = isSameDay(date, today);
        return (
          <button
            key={date.toISOString()}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(date)}
            className={`flex w-16 shrink-0 flex-col items-center justify-center rounded-[22px] transition-all ${
              disabled
                ? "h-[88px] cursor-not-allowed bg-muted/60 text-muted-foreground opacity-50"
                : active
                  ? "h-[104px] bg-primary text-foreground shadow-[0_12px_24px_-10px_rgba(73,203,235,0.95)]"
                  : "h-[88px] bg-muted text-foreground"
            }`}
          >
            <span
              className={`text-xs font-semibold ${
                active && !disabled
                  ? "text-foreground/80"
                  : "text-foreground/60"
              }`}
            >
              {MONTHS[date.getMonth()]}
            </span>
            <span className="mt-1 text-lg font-bold leading-none">
              {date.getDate()}
            </span>
            <span
              className={`mt-1 text-xs font-medium ${
                active && !disabled
                  ? "text-foreground/75"
                  : "text-muted-foreground"
              }`}
            >
              {WEEKDAYS[date.getDay()]}
            </span>
            <span
              className={`mt-2 h-1.5 w-1.5 rounded-full ${
                active && !disabled ? "bg-foreground" : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthContext();
  const {
    mutate: createReservationRequest,
    isLoading: isCreatingReservation,
    error: createError,
    clearError,
  } = useCreateReservation();
  const { cities, isLoading: citiesLoading, error: citiesError } = useCities();
  const [searchParams] = useSearchParams();

  const cityIdFromHome = searchParams.get("cityId") || "";
  const cityNameFromHome = searchParams.get("cityName") || "";
  const fromHome = Boolean(cityNameFromHome);

  const [currentStep, setCurrentStep] = useState(fromHome ? 2 : 1);
  const [selectedCityId, setSelectedCityId] = useState(cityIdFromHome);
  const [selectedCity, setSelectedCity] = useState(cityNameFromHome);
  const [selectedDate, setSelectedDate] = useState(getTomorrow);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [complaint, setComplaint] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [submitError, setSubmitError] = useState(
    () => location.state?.reservationError || "",
  );

  useEffect(() => {
    const raw = sessionStorage.getItem(PENDING_BOOKING_KEY);
    if (!raw) return;

    try {
      const pending = JSON.parse(raw);
      if (pending.cityId) setSelectedCityId(String(pending.cityId));
      if (pending.city) setSelectedCity(pending.city);
      if (pending.therapistCode) {
        setSelectedTherapist(pending.therapistCode);
        setCurrentStep(3);
      }
      if (pending.complaint) setComplaint(pending.complaint);
      if (pending.address) setAddress(pending.address);
      if (pending.addressDetail) setAddressDetail(pending.addressDetail);
      const pendingDate = parseDateParam(pending.dateTime);
      if (pendingDate) setSelectedDate(pendingDate);
      if (location.state?.reservationError) setReservationOpen(true);
    } catch {
      sessionStorage.removeItem(PENDING_BOOKING_KEY);
    }
  }, [location.state]);

  useEffect(() => {
    if (cityIdFromHome || citiesLoading || cities.length === 0) return;
    if (selectedCityId) return;

    const firstCity = cities[0];
    setSelectedCityId(String(firstCity.id));
    setSelectedCity(firstCity.name || "");
  }, [cities, citiesLoading, cityIdFromHome, selectedCityId]);

  const {
    therapists,
    isLoading: therapistsLoading,
    error: therapistsError,
  } = useTherapists(selectedCityId, selectedDate);

  const canProceedStep1 = selectedCity;
  const canProceedStep3 = selectedTherapist !== null;

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 2 && fromHome) {
      navigate("/");
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeReservation = () => {
    if (isCreatingReservation) return;
    setReservationOpen(false);
  };

  const handleCreateReservation = async () => {
    const therapist =
      therapists.find((item) => item.code === selectedTherapist) || null;
    const dateTime = formatDateParam(selectedDate);
    const payload = buildReservationPayload({
      cityId: selectedCityId,
      dateTime,
      therapistCode: selectedTherapist,
      address: address.trim(),
      addressDetail: addressDetail.trim(),
      serviceId: therapist?.serviceId ?? therapist?.service_id,
    });
    const bookingData = {
      city: selectedCity,
      cityId: payload.city_id,
      date: dateTime,
      dateTime,
      therapistId: selectedTherapist,
      therapistCode: selectedTherapist,
      therapist,
      complaint: complaint.trim(),
      address: payload.address,
      addressDetail: payload.addressDetail,
      payload,
    };

    if (!isAuthenticated) {
      sessionStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(bookingData));
      navigate("/login", { state: { from: { pathname: "/booking" } } });
      return;
    }

    const result = await createReservationRequest(payload);
    if (!result.success) return;

    sessionStorage.removeItem(PENDING_BOOKING_KEY);
    navigate("/history", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg">
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
              {fromHome && currentStep === 2 && (
                <span className="ml-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-foreground">
                  {selectedCity}
                </span>
              )}
              <div>
                <h1 className="text-lg font-bold">Booking</h1>
                <p className="text-xs text-muted-foreground">
                  Step {currentStep} dari 3
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="flex gap-2">
            {[1, 2, 3].map((step) => (
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

      <main className="px-4 pt-5">
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <MapPin className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Pilih Lokasi</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Dimana lokasi sesi terapi Anda?
              </p>
            </div>

            <CityStrip
              cities={cities}
              selectedId={selectedCityId}
              isLoading={citiesLoading}
              error={citiesError}
              onSelect={(city) => {
                setSelectedCityId(String(city.id));
                setSelectedCity(city.name || "");
                setSelectedTherapist(null);
              }}
            />

            <div>
              <Button
                size="lg"
                className="h-14 w-full rounded-full bg-primary text-foreground hover:bg-primary/90 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
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
          <div className="space-y-5">
            <div>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Pilih Tanggal</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Kapan Anda ingin melakukan sesi?
              </p>
            </div>

            <DateStrip
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setSelectedTherapist(null);
              }}
            />

            <div>
              <Button
                size="lg"
                className="h-14 w-full rounded-full bg-primary text-foreground hover:bg-primary/90 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
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
          <div className="space-y-5">
            <div>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background">
                <User className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Pilih Terapis</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Terapis tersedia di {selectedCity}
              </p>
            </div>

            <div className="space-y-3">
              {therapistsLoading && (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Memuat daftar terapis...
                </div>
              )}
              {!therapistsLoading && therapistsError && (
                <div className="py-10 text-center text-sm text-destructive">
                  {therapistsError}
                </div>
              )}
              {!therapistsLoading &&
                !therapistsError &&
                therapists.length === 0 && (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    Tidak ada terapis tersedia di kota ini.
                  </div>
                )}
              {!therapistsLoading &&
                therapists.map((therapist) => (
                  <TherapistCard
                    key={therapist.code}
                    therapist={therapist}
                    selected={selectedTherapist === therapist.code}
                    onSelect={setSelectedTherapist}
                  />
                ))}
            </div>

            {/* Summary */}
            {selectedTherapist && (
              <Card className="rounded-2xl bg-primary-soft p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold">
                  Ringkasan Booking
                </h3>
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
                    <span className="text-muted-foreground">Terapis</span>
                    <span className="font-semibold">
                      {selectedTherapist
                        ? therapists
                            .find((t) => t.code === selectedTherapist)
                            ?.name.split(",")[0]
                        : "-"}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total</span>
                      <span className="text-2xl font-bold">
                        {selectedTherapist
                          ? therapists.find((t) => t.code === selectedTherapist)
                              ?.price
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <div>
              <Button
                size="lg"
                className="h-14 w-full rounded-full bg-primary text-foreground hover:bg-primary/90 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                disabled={!canProceedStep3}
                onClick={() => setReservationOpen(true)}
              >
                Lanjut Pembayaran
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </main>

      <ReservationSheet
        open={reservationOpen}
        onClose={closeReservation}
        complaint={complaint}
        address={address}
        addressDetail={addressDetail}
        onComplaintChange={(value) => {
          clearError();
          setSubmitError("");
          setComplaint(value);
        }}
        onAddressChange={(value) => {
          clearError();
          setSubmitError("");
          setAddress(value);
        }}
        onAddressDetailChange={(value) => {
          clearError();
          setSubmitError("");
          setAddressDetail(value);
        }}
        onSubmit={handleCreateReservation}
        isSubmitting={isCreatingReservation}
        error={createError || submitError || null}
      />
    </div>
  );
}
