import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "user@email.com";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer > 0 && !isVerified) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isVerified]);

  const handleChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    pastedData.split("").forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return;

    setIsLoading(true);
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }, 1500);
  };

  const handleResend = () => {
    setTimer(60);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    // Simulate resend OTP
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center px-4">
        <div className="mx-auto max-w-md w-full text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-2xl">
            <CheckCircle2 className="h-14 w-14 text-white" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Email Terverifikasi!</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Akun Anda telah berhasil diverifikasi
          </p>
          <Button
            size="lg"
            className="h-12 rounded-full bg-gradient-to-r from-primary to-accent font-semibold shadow-lg"
            asChild
          >
            <Link to="/">Lanjutkan</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              asChild
            >
              <Link to="/register">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-bold">Verifikasi Email</h1>
              <p className="text-xs text-muted-foreground">Masukkan kode OTP</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-8">
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <Mail className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Verifikasi Email Anda</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Kami telah mengirimkan kode OTP ke
            </p>
            <p className="mt-1 font-semibold text-primary">{email}</p>
          </div>

          {/* OTP Input Card */}
          <Card className="rounded-2xl border-0 bg-card p-6 shadow-lg">
            <div className="space-y-6">
              <div>
                <label className="mb-4 block text-center text-sm font-medium">
                  Masukkan 6 digit kode OTP
                </label>
                <div
                  className="flex justify-center gap-2"
                  onPaste={handlePaste}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="h-14 w-14 rounded-xl border-2 border-border bg-secondary/50 text-center text-xl font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={handleVerify}
                size="lg"
                className="h-12 w-full rounded-full bg-gradient-to-r from-primary to-accent font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                disabled={!isOtpComplete || isLoading}
              >
                {isLoading ? "Memverifikasi..." : "Verifikasi"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Tidak menerima kode?{" "}
                  {timer > 0 ? (
                    <span className="font-medium">
                      Kirim ulang dalam {timer}s
                    </span>
                  ) : (
                    <button
                      onClick={handleResend}
                      className="font-semibold text-primary hover:underline"
                    >
                      Kirim ulang
                    </button>
                  )}
                </p>
              </div>
            </div>
          </Card>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Kode OTP berlaku selama 10 menit
            </p>
            <Link
              to="/register"
              className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
            >
              Ubah email
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
