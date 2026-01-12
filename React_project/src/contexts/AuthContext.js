import { createContext, useContext, useState, useEffect } from "react";

//認証コンテキスト・プロバイダー

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // 一般ユーザー
  const [admin, setAdmin] = useState(null);     // 管理者
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 一般ユーザーログイン
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("usertoken", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 管理者ログイン
  const adminLogin = (adminData, jwtToken) => {
    setAdmin(adminData);
    setToken(jwtToken);
    localStorage.setItem("admintoken", jwtToken);
    localStorage.setItem("admin", JSON.stringify(adminData));
  };

  // 一般ユーザーログアウト
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("usertoken");
    localStorage.removeItem("user");
  };

  // 管理者ログアウト
  const adminLogout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("admintoken");
    localStorage.removeItem("admin");
  };

  // 初期化処理（ユーザー or 管理者）
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedAdmin = localStorage.getItem("admin");
    const savedUserToken = localStorage.getItem("usertoken");
    const savedAdminToken = localStorage.getItem("admintoken");

    if (savedUserToken && savedUser) {
      setUser(JSON.parse(savedUser));
      setToken(savedUserToken);
    }

    if (savedAdminToken && savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
      setToken(savedAdminToken);
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        token,
        login,
        adminLogin,
        logout,
        adminLogout,
        loading,
        isLoggedIn: !!user,
        isAdminLoggedIn: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}