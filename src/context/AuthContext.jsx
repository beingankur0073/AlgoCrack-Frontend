import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return user && token ? { user: JSON.parse(user), token } : null;
  });

  const login = (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setAuth({ user, token });
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
