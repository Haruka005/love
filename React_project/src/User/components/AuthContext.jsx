//ログイン状態、情報を管理できるコンポーネント
import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const isLoggedIn = currentUser !== null;

  const login = (userData) => setCurrentUser(userData);
  const logout = () => setCurrentUser(null);

 useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/me", {
        credentials: "include",
      });
      const text = await res.text();

      try {
        const data = JSON.parse(text);
        setCurrentUser(data);
      } catch (err) {
        console.error("ユーザー情報取得失敗: JSONパースエラー", text);
      }
    } catch (err) {
      console.error("ユーザー情報取得失敗: 通信エラー", err);
    }
  };
  fetchUser();
}, []);


  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}