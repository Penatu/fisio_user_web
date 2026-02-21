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

function AppContent() {
  const location = useLocation();
  const hideBottomNav =
    ["/login", "/register", "/verify-email", "/settings"].includes(location.pathname) ||
    location.pathname.startsWith("/history/");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="mx-auto max-w-[450px] bg-white shadow-2xl min-h-screen">
        <div className={hideBottomNav ? "" : "pb-20"}>
          <Routes>
            <Route path="/" element={<HomePage />} />
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
