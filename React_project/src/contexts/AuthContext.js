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

      //サーバーからユーザー情報取得
      fetch("http://localhost:8000/api/me", {
        headers: { "Authorization": `Bearer ${savedToken}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) setUser(data.user);
          else localStorage.removeItem("token"); // 無効なトークンなら削除
        })
        .catch(() => localStorage.removeItem("token"));
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

  // ログイン状態と現在のユーザー情報を提供（MyPageなどで使う）
  const isLoggedIn = !!user;        // userが存在すればtrue
  const currentUser = user;         // userをそのまま渡す

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// カスタムフックで Context を簡単に利用
export const useAuth = () => useContext(AuthContext);
