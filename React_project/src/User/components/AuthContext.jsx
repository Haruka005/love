//ログイン状態、情報を管理できるコンポーネント
import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => setCurrentUser(userData);
  const logout = () => {
    setCurrentUser(null);
  };

 useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/me", {
        credentials: "include",
      });
      const text = await res.text();

      if (!res.ok) {
        // 401 など → 未ログインとして扱う
        setCurrentUser(null);
      } else {
        const data = await res.json();
        setCurrentUser(data);
      }
    } catch (err) {
      console.error("ユーザー情報取得失敗: 通信エラー", err);
      setCurrentUser(null);
    }finally {
      // ローディング終了
      setLoading(false);
    }
  };
  fetchUser();
}, []);

const isLoggedIn = !!currentUser;

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}