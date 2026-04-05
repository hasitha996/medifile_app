import { createContext, useState } from "react";

export const AuthContext = createContext(null);

// Demo credentials — replace with real API calls when a backend is ready.
const DEMO_USER = { id: 1, name: "Dr. Alice Johnson", email: "alice@medifile.com", role: "doctor" };
const DEMO_PASSWORD = "password123";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    // Replace with: const data = await api.post("/auth/login", { email, password });
    if (email === DEMO_USER.email && password === DEMO_PASSWORD) {
      setUser(DEMO_USER);
      sessionStorage.setItem("auth_user", JSON.stringify(DEMO_USER));
      return true;
    }
    return false;
  };

  const register = async (name, email, _password) => {
    // Replace with: const data = await api.post("/auth/register", { name, email, password });
    const newUser = { id: Date.now(), name, email, role: "user" };
    setUser(newUser);
    sessionStorage.setItem("auth_user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
