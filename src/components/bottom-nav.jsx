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
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[450px] -translate-x-1/2 bg-background px-5 pb-5 pt-2">
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center justify-center transition-colors ${
                isActive
                  ? "gap-2 rounded-2xl bg-primary-soft px-4 py-2.5 text-foreground"
                  : "h-11 w-11 text-foreground/55"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
              {isActive && (
                <span className="text-xs font-semibold">{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
