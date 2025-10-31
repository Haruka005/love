import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // ユーザー情報（nullなら未ログイン）
  const [currentUser, setCurrentUser] = useState(null);

  // ログイン状態を判定
  const isLoggedIn = currentUser !== null;

  // ログイン処理（ログイン成功時に呼ぶ）
  const login = (userData) => {
    setCurrentUser(userData);
  };

  // ログアウト処理
  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}