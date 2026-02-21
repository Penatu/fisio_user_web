import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  LogOut,
  User,
  Mail,
  Phone,
  ChevronRight,
  Shield,
  Bell,
  HelpCircle,
  FileText,
  Loader2,
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAuthFetch } from "@/hooks/useAuthFetch";

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const { authFetch } = useAuthFetch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userName =
    user?.name ||
    user?.fullName ||
    user?.full_name ||
    user?.email ||
    "Pengguna";
  const userEmail = user?.email || "-";
  const userPhone =
    user?.phone || user?.phoneNumber || user?.phone_number || null;
  const initials = getInitials(
    user?.name || user?.fullName || user?.full_name || null,
  );

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authFetch("/auth-user/user/logout", { method: "POST" });
    } catch {
      // logout locally regardless of server response
    } finally {
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-lg">
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
              <h1 className="text-lg font-bold">Pengaturan</h1>
              <p className="text-xs text-muted-foreground">Kelola akun Anda</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-5">
        {/* Profile Card */}
        <Card className="rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-md">
              <span className="text-xl font-bold text-primary-foreground">
                {initials}
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold">{userName}</p>
              <p className="truncate text-sm text-muted-foreground">
                {userEmail}
              </p>
              {userPhone && (
                <p className="truncate text-sm text-muted-foreground">
                  {userPhone}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Account Info */}
        <div>
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Informasi Akun
          </p>
          <Card className="divide-y divide-border rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Nama</p>
                <p className="truncate text-sm font-medium">{userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="truncate text-sm font-medium">{userEmail}</p>
              </div>
            </div>
            {userPhone && (
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Telepon</p>
                  <p className="truncate text-sm font-medium">{userPhone}</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Menu */}
        <div>
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Lainnya
          </p>
          <Card className="divide-y divide-border rounded-2xl shadow-sm overflow-hidden">
            {[
              {
                icon: Shield,
                label: "Keamanan & Privasi",
                color: "bg-chart-2/10 text-chart-2",
              },
              {
                icon: HelpCircle,
                label: "Bantuan",
                color: "bg-chart-3/10 text-chart-3",
              },
              {
                icon: FileText,
                label: "Syarat & Ketentuan",
                color: "bg-chart-4/10 text-chart-4",
              },
            ].map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/50"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="flex-1 text-sm font-medium">{label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </Card>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full h-12 rounded-2xl border-destructive/40 text-destructive hover:bg-destructive/5 hover:border-destructive font-semibold"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-5 w-5" />
          )}
          {isLoggingOut ? "Keluar..." : "Keluar dari Akun"}
        </Button>

        <p className="pb-4 text-center text-xs text-muted-foreground">
          PhysioBook v1.0.0
        </p>
      </main>
    </div>
  );
}
