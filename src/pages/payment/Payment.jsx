import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  ChevronDown,
  FileText,
  ImagePlus,
  X,
} from "lucide-react";

const BANKS = [
  "BCA",
  "Mandiri",
  "BNI",
  "BRI",
  "BSI",
  "CIMB Niaga",
  "Permata",
  "Danamon",
  "BTN",
  "OCBC",
  "Maybank",
  "Bank Jago",
  "Lainnya",
];

const MAX_PROOF_SIZE = 5 * 1024 * 1024;
const fieldClass = "h-12 rounded-xl border-border bg-secondary/50 px-4 text-sm";

function formatRupiah(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "–";
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function validate({ bankName, otherBank, accountNumber, accountName, proof }) {
  const errors = {};
  const resolvedBank = bankName === "Lainnya" ? otherBank.trim() : bankName;

  if (!resolvedBank) {
    errors.bankName = bankName === "Lainnya" ? "Isi nama bank." : "Pilih nama bank.";
  }
  if (!/^\d{8,20}$/.test(accountNumber)) {
    errors.accountNumber = "Nomor rekening harus 8–20 digit.";
  }
  if (accountName.trim().length < 3) {
    errors.accountName = "Nama pemilik rekening minimal 3 karakter.";
  }
  if (!proof) {
    errors.proof = "Unggah bukti transfer.";
  } else if (
    !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(proof.type)
  ) {
    errors.proof = "Bukti transfer harus berupa JPG, PNG, WEBP, atau PDF.";
  } else if (proof.size > MAX_PROOF_SIZE) {
    errors.proof = "Ukuran bukti transfer maksimal 5 MB.";
  }

  return errors;
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking || location.state?.bookingData || null;
  const backTo =
    booking?.id && booking.id !== "-" ? `/history/${booking.id}` : "/history";

  const [bankName, setBankName] = useState("");
  const [otherBank, setOtherBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [proof, setProof] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!proof || !proof.type.startsWith("image/")) {
      setPreviewUrl("");
      return undefined;
    }

    const url = URL.createObjectURL(proof);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [proof]);

  const clearError = (name) => {
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const handleProofChange = (event) => {
    const file = event.target.files?.[0] || null;
    setProof(file);
    clearError("proof");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate({
      bankName,
      otherBank,
      accountNumber,
      accountName,
      proof,
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsProcessing(true);
    navigate("/payment/success", {
      state: {
        booking,
        payment: {
          bankName: bankName === "Lainnya" ? otherBank.trim() : bankName,
          accountNumber,
          accountName: accountName.trim(),
          proofName: proof.name,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link to={backTo}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-bold">Pembayaran</h1>
              <p className="text-xs text-muted-foreground">
                Konfirmasi transfer bank
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Card className="gap-4 rounded-2xl border-0 bg-primary-soft p-5 shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">Total pembayaran</p>
              <p className="mt-1 text-4xl font-bold">
                {formatRupiah(booking?.amount)}
              </p>
            </div>
            {(booking?.serviceFee != null || booking?.adminFee != null) && (
              <div className="space-y-2 text-sm">
                {booking?.serviceFee != null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sesi fisioterapi</span>
                    <span className="font-semibold">
                      {formatRupiah(booking.serviceFee)}
                    </span>
                  </div>
                )}
                {booking?.adminFee != null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Biaya admin</span>
                    <span className="font-semibold">
                      {formatRupiah(booking.adminFee)}
                    </span>
                  </div>
                )}
              </div>
            )}
            {booking && (
              <div className="space-y-1 border-t border-foreground/10 pt-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Kode order</span>
                  <span className="font-semibold">{booking.id}</span>
                </div>
                {booking.therapistName && (
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Terapis</span>
                    <span className="text-right font-semibold">
                      {booking.therapistName}
                    </span>
                  </div>
                )}
                {(booking.date || booking.time) && (
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Jadwal</span>
                    <span className="text-right font-semibold">
                      {[booking.date, booking.time].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            )}
          </Card>

          <section className="space-y-2">
            <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Data rekening pengirim
            </p>
            <Card className="gap-4 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">
                Transfer sesuai total di atas, lalu isi rekening yang dipakai untuk
                transfer.
              </p>

              <div className="space-y-2">
                <Label htmlFor="bankName">Nama bank</Label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <select
                    id="bankName"
                    value={bankName}
                    onChange={(event) => {
                      setBankName(event.target.value);
                      clearError("bankName");
                    }}
                    aria-invalid={Boolean(errors.bankName)}
                    className={`${fieldClass} w-full appearance-none pr-10 pl-10 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 ${
                      bankName ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <option value="">Pilih bank</option>
                    {BANKS.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                <FieldError message={errors.bankName} />
              </div>

              {bankName === "Lainnya" && (
                <div className="space-y-2">
                  <Label htmlFor="otherBank">Nama bank lainnya</Label>
                  <Input
                    id="otherBank"
                    value={otherBank}
                    onChange={(event) => {
                      setOtherBank(event.target.value);
                      clearError("bankName");
                    }}
                    placeholder="Masukkan nama bank"
                    aria-invalid={Boolean(errors.bankName)}
                    className={fieldClass}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Nomor rekening</Label>
                <Input
                  id="accountNumber"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="1234567890"
                  value={accountNumber}
                  onChange={(event) => {
                    setAccountNumber(event.target.value.replace(/\D/g, "").slice(0, 20));
                    clearError("accountNumber");
                  }}
                  aria-invalid={Boolean(errors.accountNumber)}
                  className={fieldClass}
                />
                <FieldError message={errors.accountNumber} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountName">Nama pemilik rekening</Label>
                <Input
                  id="accountName"
                  autoComplete="name"
                  placeholder="Nama sesuai rekening"
                  value={accountName}
                  onChange={(event) => {
                    setAccountName(event.target.value);
                    clearError("accountName");
                  }}
                  aria-invalid={Boolean(errors.accountName)}
                  className={fieldClass}
                />
                <FieldError message={errors.accountName} />
              </div>
            </Card>
          </section>

          <section className="space-y-2">
            <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Bukti transfer
            </p>
            <Card className="gap-3 rounded-2xl p-5 shadow-sm">
              <Label htmlFor="proof">Unggah bukti transfer</Label>
              <label
                htmlFor="proof"
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-8 text-center ${
                  errors.proof ? "border-destructive" : "border-border"
                } bg-secondary/40`}
              >
                <ImagePlus className="mb-2 h-6 w-6 text-muted-foreground" />
                <span className="text-sm font-semibold">Pilih foto atau PDF</span>
                <span className="mt-1 text-xs text-muted-foreground">
                  JPG, PNG, WEBP, atau PDF. Maksimal 5 MB.
                </span>
              </label>
              <input
                id="proof"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="sr-only"
                onChange={handleProofChange}
              />

              {proof && (
                <div className="flex items-center gap-3 rounded-xl bg-secondary/60 p-3">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Pratinjau bukti transfer"
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-background">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{proof.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(proof.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => {
                      setProof(null);
                      clearError("proof");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <FieldError message={errors.proof} />
            </Card>
          </section>

          {Object.keys(errors).length > 0 && (
            <div className="flex items-start gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Lengkapi data transfer sebelum mengirim bukti.</span>
            </div>
          )}

          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-primary font-semibold text-foreground shadow-lg hover:bg-primary/90"
            disabled={isProcessing}
          >
            {isProcessing ? "Mengirim..." : "Kirim bukti transfer"}
          </Button>
        </form>
      </main>
    </div>
  );
}
