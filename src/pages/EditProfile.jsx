import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  MapPin,
  Phone,
  User,
} from "lucide-react";

const GENDERS = [
  { value: "laki-laki", label: "Laki-laki" },
  { value: "perempuan", label: "Perempuan" },
];

const PROVINCE_GROUPS = [
  {
    label: "Sumatera",
    options: [
      "Aceh",
      "Sumatera Utara",
      "Sumatera Barat",
      "Riau",
      "Kepulauan Riau",
      "Jambi",
      "Sumatera Selatan",
      "Kepulauan Bangka Belitung",
      "Bengkulu",
      "Lampung",
    ],
  },
  {
    label: "Jawa",
    options: [
      "DKI Jakarta",
      "Banten",
      "Jawa Barat",
      "Jawa Tengah",
      "DI Yogyakarta",
      "Jawa Timur",
    ],
  },
  {
    label: "Bali & Nusa Tenggara",
    options: ["Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur"],
  },
  {
    label: "Kalimantan",
    options: [
      "Kalimantan Barat",
      "Kalimantan Tengah",
      "Kalimantan Selatan",
      "Kalimantan Timur",
      "Kalimantan Utara",
    ],
  },
  {
    label: "Sulawesi",
    options: [
      "Sulawesi Utara",
      "Gorontalo",
      "Sulawesi Tengah",
      "Sulawesi Barat",
      "Sulawesi Selatan",
      "Sulawesi Tenggara",
    ],
  },
  {
    label: "Maluku & Papua",
    options: [
      "Maluku",
      "Maluku Utara",
      "Papua",
      "Papua Barat",
      "Papua Barat Daya",
      "Papua Selatan",
      "Papua Tengah",
      "Papua Pegunungan",
    ],
  },
];

const fieldClass =
  "h-12 rounded-xl border-border bg-secondary/50 px-4 text-sm";

function readProfile(user) {
  return {
    fullName: user?.name || user?.fullName || user?.full_name || "",
    phone: user?.phone || user?.phoneNumber || user?.phone_number || "",
    gender: user?.gender || "",
    birthPlace: user?.birthPlace || user?.birth_place || "",
    birthDate: user?.birthDate || user?.birth_date || "",
    province: user?.province || "",
    city: user?.city || "",
    postalCode: user?.postalCode || user?.postal_code || "",
    address: user?.address || "",
  };
}

function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function validate(form) {
  const errors = {};
  const phone = form.phone.replace(/[\s-]/g, "");

  if (form.fullName.trim().length < 3) {
    errors.fullName = "Nama lengkap minimal 3 karakter.";
  }
  if (!/^(\+62|62|0)8\d{8,12}$/.test(phone)) {
    errors.phone = "Masukkan nomor HP yang valid, contoh 081234567890.";
  }
  if (!form.gender) {
    errors.gender = "Pilih jenis kelamin.";
  }
  if (form.birthPlace.trim().length < 2) {
    errors.birthPlace = "Isi tempat lahir.";
  }
  if (!form.birthDate) {
    errors.birthDate = "Isi tanggal lahir.";
  } else if (form.birthDate > todayIso()) {
    errors.birthDate = "Tanggal lahir tidak boleh di masa depan.";
  }
  if (!form.province) {
    errors.province = "Pilih provinsi.";
  }
  if (form.city.trim().length < 2) {
    errors.city = "Isi kota atau kabupaten.";
  }
  if (!/^\d{5}$/.test(form.postalCode.trim())) {
    errors.postalCode = "Kode pos harus 5 digit.";
  }
  if (form.address.trim().length < 8) {
    errors.address = "Isi alamat lengkap, minimal nama jalan dan nomor.";
  }

  return errors;
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthContext();
  const [form, setForm] = useState(() => readProfile(user));
  const [errors, setErrors] = useState({});

  const setField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const handleChange = (event) => {
    setField(event.target.name, event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const fullName = form.fullName.trim();
    const phone = form.phone.replace(/[\s-]/g, "");

    updateUser({
      name: fullName,
      fullName,
      phone,
      gender: form.gender,
      birthPlace: form.birthPlace.trim(),
      birthDate: form.birthDate,
      province: form.province,
      city: form.city.trim(),
      postalCode: form.postalCode.trim(),
      address: form.address.trim(),
    });

    navigate("/settings", { state: { profileUpdated: true } });
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
              <Link to="/settings">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-bold">Ubah Profil</h1>
              <p className="text-xs text-muted-foreground">
                Perbarui informasi umum Anda
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <section className="space-y-2">
            <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Informasi umum
            </p>
            <Card className="gap-4 rounded-2xl p-5 shadow-sm">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama lengkap</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    placeholder="Nama sesuai identitas"
                    value={form.fullName}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.fullName)}
                    className={`${fieldClass} pl-10`}
                  />
                </div>
                <FieldError message={errors.fullName} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor HP</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="081234567890"
                    value={form.phone}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.phone)}
                    className={`${fieldClass} pl-10`}
                  />
                </div>
                <FieldError message={errors.phone} />
              </div>

              <div className="space-y-2">
                <Label id="gender-label">Jenis kelamin</Label>
                <div
                  role="group"
                  aria-labelledby="gender-label"
                  className="grid grid-cols-2 gap-2"
                >
                  {GENDERS.map((option) => {
                    const selected = form.gender === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setField("gender", option.value)}
                        className={`h-12 rounded-xl text-sm font-semibold transition-colors ${
                          selected
                            ? "bg-primary text-foreground shadow-sm"
                            : "bg-secondary/50 text-muted-foreground"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                <FieldError message={errors.gender} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthPlace">Tempat lahir</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="birthPlace"
                    name="birthPlace"
                    placeholder="Kota kelahiran"
                    value={form.birthPlace}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.birthPlace)}
                    className={`${fieldClass} pl-10`}
                  />
                </div>
                <FieldError message={errors.birthPlace} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Tanggal lahir</Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  autoComplete="bday"
                  max={todayIso()}
                  value={form.birthDate}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.birthDate)}
                  className={fieldClass}
                />
                <FieldError message={errors.birthDate} />
              </div>
            </Card>
          </section>

          <section className="space-y-2">
            <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Alamat
            </p>
            <Card className="gap-4 rounded-2xl p-5 shadow-sm">
              <div className="space-y-2">
                <Label htmlFor="province">Provinsi</Label>
                <div className="relative">
                  <select
                    id="province"
                    name="province"
                    autoComplete="address-level1"
                    value={form.province}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.province)}
                    className={`${fieldClass} w-full appearance-none pr-10 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 ${
                      form.province ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <option value="">Pilih provinsi</option>
                    {PROVINCE_GROUPS.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.options.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                <FieldError message={errors.province} />
              </div>

              <div className="grid grid-cols-5 gap-3">
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="city">Kota</Label>
                  <Input
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    placeholder="Kota / kabupaten"
                    value={form.city}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.city)}
                    className={fieldClass}
                  />
                  <FieldError message={errors.city} />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="postalCode">Kode pos</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="12345"
                    maxLength={5}
                    value={form.postalCode}
                    onChange={(event) =>
                      setField(
                        "postalCode",
                        event.target.value.replace(/\D/g, "").slice(0, 5),
                      )
                    }
                    aria-invalid={Boolean(errors.postalCode)}
                    className={fieldClass}
                  />
                  <FieldError message={errors.postalCode} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat lengkap</Label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  autoComplete="street-address"
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan"
                  value={form.address}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.address)}
                  className="w-full resize-none rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
                <FieldError message={errors.address} />
              </div>
            </Card>
          </section>

          {Object.keys(errors).length > 0 && (
            <div className="flex items-start gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Periksa kembali data yang belum lengkap.</span>
            </div>
          )}

          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-primary font-semibold text-foreground shadow-lg hover:bg-primary/90"
          >
            Simpan perubahan
          </Button>
        </form>
      </main>
    </div>
  );
}
