import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { BottomNav } from "@/components/bottom-nav";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import HomePage from "@/pages/Home";
import BookingPage from "@/pages/Booking";
import ChatPage from "@/pages/Chat";
import HistoryPage from "@/pages/History";
import HistoryDetailPage from "@/pages/HistoryDetail";
import PaymentPage from "@/pages/payment/Payment";
import PaymentSuccessPage from "@/pages/payment/PaymentSuccess";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import VerifyEmailPage from "@/pages/VerifyEmail";
import SettingsPage from "@/pages/Settings";
import EditProfilePage from "@/pages/EditProfile";
import NotificationsPage from "@/pages/Notifications";

function AppContent() {
  const location = useLocation();
  const hideBottomNav =
    ["/login", "/register", "/verify-email"].includes(location.pathname) ||
    location.pathname.startsWith("/settings/") ||
    location.pathname.startsWith("/notifications") ||
    location.pathname.startsWith("/history/") ||
    location.pathname.startsWith("/payment");

  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto min-h-screen max-w-[450px] bg-background shadow-[0_12px_50px_-24px_rgba(0,0,0,0.25)]">
        <div className={hideBottomNav ? "" : "pb-20"}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history/:id"
              element={
                <ProtectedRoute>
                  <HistoryDetailPage />
                </ProtectedRoute>
              }
            />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/profile"
              element={
                <ProtectedRoute>
                  <EditProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        {!hideBottomNav && <BottomNav />}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
