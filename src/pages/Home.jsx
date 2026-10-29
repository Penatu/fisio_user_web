import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
          c.name.toLowerCase().includes(query.toLowerCase()),
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
      navigate(
        `/booking?cityId=${selected.id}&cityName=${encodeURIComponent(selected.name)}`,
      );
    } else {
      navigate("/booking");
    }
  };

  return (
    <div ref={containerRef}>
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-12 rounded-full border-0 bg-muted pl-11 pr-11 text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-primary"
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={handleClear}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {open && filtered.length > 0 && (
          <ul className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-[22px] border border-border bg-background py-1 text-foreground shadow-[0_16px_40px_-20px_rgba(0,0,0,0.35)]">
            {filtered.map((city) => (
              <li
                key={city.id}
                className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(city)}
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-foreground" />
                {city.name}
              </li>
            ))}
          </ul>
        )}

        {open &&
          query.trim().length > 0 &&
          filtered.length === 0 &&
          !isLoading && (
            <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground shadow-lg">
              Kota tidak ditemukan
            </div>
          )}
      </div>

      <Button
        size="lg"
        className="mt-2.5 h-12 w-full rounded-full bg-foreground font-semibold text-background shadow-none hover:bg-foreground/90"
        onClick={handleBooking}
      >
        {selected ? `Booking di ${selected.name}` : "Booking Sekarang"}
        <ChevronRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}

const features = [
  {
    icon: MapPin,
    title: "Pilih Lokasi",
    copy: "Temukan terapis di kota atau kabupaten Anda di seluruh Indonesia",
    card: "bg-primary text-foreground",
  },
  {
    icon: Calendar,
    title: "Atur Jadwal",
    copy: "Pilih tanggal dan waktu yang sesuai dengan kebutuhan Anda",
    card: "bg-accent text-foreground",
  },
  {
    icon: MessageSquare,
    title: "Chat Real-time",
    copy: "Konsultasi langsung dengan terapis melalui chat",
    card: "bg-primary-soft text-foreground",
  },
  {
    icon: Clock,
    title: "History Lengkap",
    copy: "Lihat riwayat booking dan pembayaran Anda",
    card: "bg-foreground text-background",
  },
];

function FeatureCarousel() {
  const scrollerRef = useRef(null);
  const [active, setActive] = useState(0);

  const updateActive = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const left = el.scrollLeft;
    let closest = 0;
    let min = Infinity;
    Array.from(el.children).forEach((child, index) => {
      const distance = Math.abs(child.offsetLeft - el.offsetLeft - left);
      if (distance < min) {
        min = distance;
        closest = index;
      }
    });
    setActive(closest);
  };

  const scrollTo = (index) => {
    const el = scrollerRef.current;
    const child = el?.children[index];
    if (!el || !child) return;
    const origin = el.children[0]?.offsetLeft ?? 0;
    el.scrollTo({
      left: child.offsetLeft - origin,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-6" aria-roledescription="carousel">
      <div className="mb-4 flex items-end justify-between gap-4 px-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Booking Fisioterapi
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Geser untuk lihat layanannya
          </p>
        </div>
      </div>
      <div
        ref={scrollerRef}
        onScroll={updateActive}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-4 px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {features.map(({ icon: Icon, title, copy, card }) => (
          <article
            key={title}
            className={`flex min-h-[196px] w-[78%] shrink-0 snap-start flex-col justify-between rounded-[28px] p-5 ${card}`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background text-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold leading-tight">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed opacity-75">
                {copy}
              </p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {features.map((feature, index) => (
          <button
            key={feature.title}
            type="button"
            aria-label={`Tampilkan ${feature.title}`}
            onClick={() => scrollTo(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === active ? "w-6 bg-foreground" : "w-1.5 bg-foreground/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthContext();
  const initials = getInitials(
    user?.name || user?.fullName || user?.full_name || null,
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <span className="text-lg font-bold text-foreground">P</span>
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
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground">
                {initials ? (
                  <span className="text-xs font-bold text-background">
                    {initials}
                  </span>
                ) : (
                  <div className="h-5 w-5 rounded-full bg-background/30" />
                )}
              </div>
            </Button>
          </div>
        </div>
      </header>

      <section className="px-4 pt-6">
        <div className="relative z-20 mb-6 rounded-[28px] bg-primary p-3 text-foreground">
          <div className="px-3 pb-4 pt-3">
            <h2 className="text-[1.7rem] font-bold leading-[1.15] tracking-tight text-balance">
              Booking Fisioterapi Professional
            </h2>
            <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-foreground/70">
              Temukan terapis profesional di kota Anda dengan mudah
            </p>
          </div>
          <div className="rounded-[22px] bg-background p-3.5">
            <CitySearch />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-3 divide-x divide-border overflow-hidden rounded-[24px] bg-muted">
          {[
            ["500+", "Terapis"],
            ["50+", "Kota"],
            ["4.9", "Rating"],
          ].map(([value, label]) => (
            <div key={label} className="px-3 py-4 text-center">
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <FeatureCarousel />

      <footer className="mt-4 border-t border-border bg-muted px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground">
            <span className="text-lg font-bold text-background">P</span>
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
