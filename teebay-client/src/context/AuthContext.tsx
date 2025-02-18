import React, { createContext, useContext, useState, useEffect } from "react";
import { getAccessToken, setAccessToken } from "../utils/tokenManager";

interface AuthContextProps {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getAccessToken();
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []);

  const login = (token: string) => {
    setAccessToken(token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setAccessToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
