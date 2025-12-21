// AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // ← User → user に修正
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ログイン処理
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("user", JSON.stringify(userData)); // ← 丸ごと保存

  };

  // ログアウト処理
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("user");
  };

  // 初期化処理（リロード時）
 useEffect(() => {
  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!savedToken) {
    setLoading(false);
    return;
  }

  setToken(savedToken);
  if (savedUser) {
    setUser(JSON.parse(savedUser)); // ← id も復元
  }

  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data)); // ← 丸ごと保存
        setUser(data);
      } else {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error("ユーザー情報取得エラー:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);
  const isLoggedIn = !!user;   // ← User → user に修正

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, login, logout, loading }} // ← User → user に修正
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}