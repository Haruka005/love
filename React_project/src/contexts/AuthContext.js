// AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ログイン処理
  const login = (userData, jwtToken) => {
    setCurrentUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("userName", userData.name);
  };

  // ログアウト処理
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
  };

  // 初期化処理（リロード時）
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserName = localStorage.getItem("userName");

    if (!savedToken) {
      setLoading(false);
      return;
    }

    setToken(savedToken);
    if (savedUserName) {
      setCurrentUser({ name: savedUserName });
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("userName", data.name);
          setCurrentUser(data);
        } else {
          localStorage.removeItem("token");
          setToken(null);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("ユーザー情報取得エラー:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const isLoggedIn = !!currentUser;

  return (
    <AuthContext.Provider
      value={{ currentUser, token, isLoggedIn, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}