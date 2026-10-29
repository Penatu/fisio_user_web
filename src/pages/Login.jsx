import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: loginUser, isLoading, error, clearError } = useLogin();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginUser({ email, password });
    if (result.success) {
      const pendingBookingRaw = sessionStorage.getItem(
        "fisiobook_pending_booking",
      );
      if (pendingBookingRaw) {
        sessionStorage.removeItem("fisiobook_pending_booking");
        const bookingData = JSON.parse(pendingBookingRaw);
        navigate("/payment", { replace: true, state: { bookingData } });
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              asChild
            >
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-bold">Login</h1>
              <p className="text-xs text-muted-foreground">
                Masuk ke akun Anda
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-8">
        <div className="mx-auto max-w-md">
          {/* Logo/Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-foreground shadow-lg">
              <span className="text-2xl font-bold text-primary-foreground">
                P
              </span>
            </div>
            <h2 className="text-2xl font-bold">Selamat Datang</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Masuk untuk melanjutkan ke PhysioBook
            </p>
          </div>

          {/* Login Form */}
          <Card className="rounded-2xl border-0 bg-card p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError();
                    }}
                    className="h-12 rounded-xl border-border bg-secondary/50 pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError();
                    }}
                    className="h-12 rounded-xl border-border bg-secondary/50 pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-foreground hover:underline"
                >
                  Lupa password?
                </Link>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="h-12 w-full rounded-full bg-primary text-foreground hover:bg-primary/90 font-semibold shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? "Masuk..." : "Masuk"}
              </Button>
            </form>
          </Card>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="font-semibold text-foreground hover:underline"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
