import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, MessageSquare, Clock } from "lucide-react";

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/booking", icon: Calendar, label: "Booking" },
    { href: "/chat", icon: MessageSquare, label: "Chat" },
    { href: "/history", icon: Clock, label: "History" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[450px] -translate-x-1/2 border-t border-border bg-card/80 backdrop-blur-lg">
      <div className="grid grid-cols-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
