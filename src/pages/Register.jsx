import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      navigate("/verify-email", { state: { email: formData.email } });
    }, 1500);
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.phone &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

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
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-bold">Daftar</h1>
              <p className="text-xs text-muted-foreground">Buat akun baru</p>
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
            <h2 className="text-2xl font-bold">Daftar Sekarang</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Bergabung dengan PhysioBook hari ini
            </p>
          </div>

          {/* Register Form */}
          <Card className="rounded-2xl border-0 bg-card p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nama Lengkap
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-border bg-secondary/50 pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-border bg-secondary/50 pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Nomor Telepon
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="081234567890"
                    value={formData.phone}
                    onChange={handleChange}
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 8 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-border bg-secondary/50 pl-10 pr-10"
                    required
                    minLength={8}
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

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Konfirmasi Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-border bg-secondary/50 pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-destructive">
                      Password tidak cocok
                    </p>
                  )}
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-border text-foreground focus:ring-primary"
                    required
                  />
                  <span className="text-muted-foreground">
                    Saya setuju dengan{" "}
                    <Link
                      to="/terms"
                      className="font-medium text-foreground hover:underline"
                    >
                      Syarat & Ketentuan
                    </Link>{" "}
                    dan{" "}
                    <Link
                      to="/privacy"
                      className="font-medium text-foreground hover:underline"
                    >
                      Kebijakan Privasi
                    </Link>
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-12 w-full rounded-full bg-primary text-foreground hover:bg-primary/90 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? "Mendaftar..." : "Daftar"}
              </Button>
            </form>
          </Card>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-semibold text-foreground hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
