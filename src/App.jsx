import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { BottomNav } from "@/components/bottom-nav";
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

function AppContent() {
  const location = useLocation();
  const hideBottomNav =
    ["/login", "/register", "/verify-email"].includes(location.pathname) ||
    location.pathname.startsWith("/history/");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="mx-auto max-w-[450px] bg-white shadow-2xl min-h-screen">
        <div className={hideBottomNav ? "" : "pb-20"}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/history/:id" element={<HistoryDetailPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
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
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
