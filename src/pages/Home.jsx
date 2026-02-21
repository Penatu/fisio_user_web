import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  MapPin,
  MessageSquare,
  Clock,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { useCities } from "@/hooks/useCities";
import { useAuthContext } from "@/contexts/AuthContext";

function getInitials(name) {
  if (!name) return null;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function CitySearch() {
  const { cities, isLoading } = useCities();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);

  const filtered =
    query.trim().length === 0
      ? cities
      : cities.filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase())
        );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    setSelected(city);
    setQuery(city.name);
    setOpen(false);
  };

  const handleClear = () => {
    setSelected(null);
    setQuery("");
    setOpen(false);
  };

  const handleBooking = () => {
    if (selected) {
      navigate(`/booking?cityId=${selected.id}&cityName=${encodeURIComponent(selected.name)}`);
    } else {
      navigate("/booking");
    }
  };

  return (
    <div className="mb-4" ref={containerRef}>
      <p className="mb-2 text-sm font-medium text-primary-foreground/80">
        Cari kota Anda
      </p>
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            className="h-11 rounded-xl border-0 bg-white pl-9 pr-9 text-foreground shadow-md placeholder:text-muted-foreground focus-visible:ring-primary"
            placeholder={isLoading ? "Memuat kota..." : "Cari kota..."}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            disabled={isLoading}
          />
          {query.length > 0 && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={handleClear}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {open && filtered.length > 0 && (
          <ul className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-border bg-white text-foreground shadow-lg">
            {filtered.map((city) => (
              <li
                key={city.id}
                className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm hover:bg-primary/5"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(city)}
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                {city.name}
              </li>
            ))}
          </ul>
        )}

        {open && query.trim().length > 0 && filtered.length === 0 && !isLoading && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-muted-foreground shadow-lg">
            Kota tidak ditemukan
          </div>
        )}
      </div>

      <Button
        size="lg"
        className="mt-3 h-11 w-full rounded-xl bg-white font-semibold text-primary shadow-md hover:bg-white/90"
        onClick={handleBooking}
      >
        {selected ? `Booking di ${selected.name}` : "Booking Sekarang"}
        <ChevronRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthContext();
  const initials = getInitials(
    user?.name || user?.fullName || user?.full_name || null
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <span className="text-lg font-bold text-primary-foreground">
                  P
                </span>
              </div>
              <div>
                <h1 className="text-lg font-bold">PhysioBook</h1>
                <p className="text-xs text-muted-foreground">
                  Booking Fisioterapi
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full p-0"
              onClick={() => navigate(isAuthenticated ? "/settings" : "/login")}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                {initials ? (
                  <span className="text-xs font-bold text-primary-foreground">
                    {initials}
                  </span>
                ) : (
                  <div className="h-5 w-5 rounded-full bg-primary-foreground/30" />
                )}
              </div>
            </Button>
          </div>
        </div>
      </header>

      <section className="px-4 py-6">
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-primary to-accent p-8 text-primary-foreground">
          <h2 className="mb-4 text-3xl font-bold leading-tight text-balance">
            Booking Fisioterapi Professional
          </h2>
          <p className="mb-6 text-sm leading-relaxed opacity-90">
            Temukan terapis profesional di kota Anda dengan mudah
          </p>
          <CitySearch />
        </div>

        <div className="mb-8 grid grid-cols-3 gap-3">
          <Card className="rounded-2xl p-4 shadow-sm">
            <p className="mb-1 text-2xl font-bold">500+</p>
            <p className="text-xs text-muted-foreground">Terapis</p>
          </Card>
          <Card className="rounded-2xl p-4 shadow-sm">
            <p className="mb-1 text-2xl font-bold">50+</p>
            <p className="text-xs text-muted-foreground">Kota</p>
          </Card>
          <Card className="rounded-2xl p-4 shadow-sm">
            <p className="mb-1 text-2xl font-bold">4.9</p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </Card>
        </div>
      </section>

      <section className="px-4 py-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <span className="text-lg font-bold text-primary-foreground">P</span>
          </div>
          <div>
            <h1 className="text-lg font-bold">PhysioBook</h1>
            <p className="text-xs text-muted-foreground">Booking Fisioterapi</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="rounded-2xl p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h4 className="mb-2 text-lg font-bold">Pilih Lokasi</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Temukan terapis di kota atau kabupaten Anda di seluruh Indonesia
            </p>
          </Card>
          <Card className="rounded-2xl p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Calendar className="h-6 w-6 text-accent" />
            </div>
            <h4 className="mb-2 text-lg font-bold">Atur Jadwal</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Pilih tanggal dan waktu yang sesuai dengan kebutuhan Anda
            </p>
          </Card>
          <Card className="rounded-2xl p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-chart-2/10">
              <MessageSquare className="h-6 w-6 text-chart-2" />
            </div>
            <h4 className="mb-2 text-lg font-bold">Chat Real-time</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Konsultasi langsung dengan terapis melalui chat
            </p>
          </Card>
          <Card className="rounded-2xl p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-chart-3/10">
              <Clock className="h-6 w-6 text-chart-3" />
            </div>
            <h4 className="mb-2 text-lg font-bold">History Lengkap</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Lihat riwayat booking dan pembayaran Anda
            </p>
          </Card>
        </div>
      </section>

      <section className="px-4 py-6">
        <Card className="rounded-3xl bg-gradient-to-br from-accent to-chart-2 p-8 text-center text-accent-foreground shadow-xl">
          <h3 className="mb-3 text-2xl font-bold leading-tight text-balance">
            Mulai Perjalanan Pemulihan Anda
          </h3>
          <p className="mb-6 text-sm leading-relaxed opacity-90">
            Booking fisioterapi profesional dalam 3 langkah mudah
          </p>
          <Button
            size="lg"
            className="h-12 rounded-full bg-white px-8 font-semibold text-accent shadow-lg hover:bg-white/90"
            asChild
          >
            <Link to="/booking">
              Mulai Booking
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </Card>
      </section>

      <footer className="mt-8 border-t border-border bg-muted/30 px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <span className="text-lg font-bold text-primary-foreground">P</span>
          </div>
          <div>
            <h5 className="font-bold">PhysioBook</h5>
            <p className="text-xs text-muted-foreground">
              Platform Booking Fisioterapi
            </p>
          </div>
        </div>
        <div className="grid gap-6">
          <div>
            <h6 className="mb-3 text-sm font-semibold">Layanan</h6>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/booking"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Booking
                </Link>
              </li>
              <li>
                <Link
                  to="/chat"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Chat
                </Link>
              </li>
              <li>
                <Link
                  to="/history"
                  className="text-muted-foreground hover:text-foreground"
                >
                  History
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="mb-3 text-sm font-semibold">Tentang</h6>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Tentang Kami</li>
              <li>Syarat & Ketentuan</li>
              <li>Kebijakan Privasi</li>
            </ul>
          </div>
          <div>
            <h6 className="mb-3 text-sm font-semibold">Kontak</h6>
            <p className="text-sm text-muted-foreground">info@physiobook.id</p>
            <p className="text-sm text-muted-foreground">+62 812-3456-7890</p>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2025 PhysioBook. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
