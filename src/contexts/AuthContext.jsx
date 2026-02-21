import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "fisiobook_auth";

function loadAuthFromStorage() {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadAuthFromStorage());

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const token = user?.token ?? null;
  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext harus digunakan di dalam AuthProvider");
  }
  return context;
}
