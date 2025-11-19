import React, { createContext, useContext, useState, useEffect } from "react";

// Context を作成
export const AuthContext = createContext();

// Provider コンポーネント
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // ログイン中のユーザー情報
  const [token, setToken] = useState(null);    // JWT トークン

  // ページリロード時に localStorage からトークンを復元
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      // ここで必要ならユーザー情報をサーバーから取得して setUser する
    }
  }, []);

  // ログイン時にトークンとユーザー情報を保存
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
  };

  // ログアウト時に情報を削除
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// カスタムフックで Context を簡単に利用
export const useAuth = () => useContext(AuthContext);
