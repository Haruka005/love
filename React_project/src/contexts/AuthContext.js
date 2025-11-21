import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ページリロード時に localStorage から復元
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);

      // トークンからユーザー情報を取得
      fetch("http://localhost:8000/api/me", {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      })
        .then(res => {
          if (!res.ok) throw new Error("Token expired or invalid");
          return res.json();
        })
        .then(data => {
          setUser(data.user);
        })
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        });
    }
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const isLoggedIn = !!user;
  const currentUser = user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);