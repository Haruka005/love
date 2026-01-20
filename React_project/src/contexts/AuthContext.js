import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

// APIのベースURLを取得する関数
const getBaseApiUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
  return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};
const API_BASE = getBaseApiUrl();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 有効期限の定数（テスト用に短く設定している場合はここを調整）
  //60*1000ミリ秒＝１分、60*60*1000ミリ秒＝１時間
  const EXPIRY_TIME = 60*60 * 1000; //１時間


  // 一般ユーザーログイン
  const login = (userData, jwtToken) => {
    const expiry = new Date().getTime() + EXPIRY_TIME;
    setUser(userData);
    setToken(jwtToken);
    
    localStorage.setItem("usertoken", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("user_expiry", expiry.toString());
  };

  // 管理者ログイン
  const adminLogin = (adminData, jwtToken) => {
    const expiry = new Date().getTime() + EXPIRY_TIME;
    setAdmin(adminData);
    setToken(jwtToken);
    
    localStorage.setItem("admintoken", jwtToken);
    localStorage.setItem("admin", JSON.stringify(adminData));
    localStorage.setItem("admin_expiry", expiry.toString());
  };

  // 一般ユーザーログアウト（サーバー側のトークンも削除する）
  const logout = async () => {
    const savedToken = localStorage.getItem("usertoken");
    
    if (savedToken) {
      try {
        // サーバー側のDBからトークンを削除
        await fetch(`${API_BASE}/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${savedToken}`,
            "Accept": "application/json"
          }
        });
      } catch (err) {
        console.error("サーバーログアウト失敗:", err);
      }
    }

    // クライアント側の情報をクリア
    setUser(null);
    setToken(null);
    localStorage.removeItem("usertoken");
    localStorage.removeItem("user");
    localStorage.removeItem("user_expiry");
  };

  // 管理者ログアウト（サーバー側のトークンも削除する）
  const adminLogout = async () => {
    const savedToken = localStorage.getItem("admintoken");

    if (savedToken) {
      try {
        // サーバー側のDBからトークンを削除
        await fetch(`${API_BASE}/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${savedToken}`,
            "Accept": "application/json"
          }
        });
      } catch (err) {
        console.error("管理者サーバーログアウト失敗:", err);
      }
    }

    setAdmin(null);
    setToken(null);
    localStorage.removeItem("admintoken");
    localStorage.removeItem("admin");
    localStorage.removeItem("admin_expiry");
  };

  // 初期化処理
  useEffect(() => {
    const now = new Date().getTime();

    // 一般ユーザーの復元と期限チェック
    const savedUser = localStorage.getItem("user");
    const savedUserToken = localStorage.getItem("usertoken");
    const userExpiry = localStorage.getItem("user_expiry");

    if (savedUserToken && savedUser && userExpiry) {
      if (now > parseInt(userExpiry)) {
        logout(); // 期限切れならサーバー含めログアウト
      } else {
        setUser(JSON.parse(savedUser));
        setToken(savedUserToken);
      }
    }

    // 管理者の復元と期限チェック
    const savedAdmin = localStorage.getItem("admin");
    const savedAdminToken = localStorage.getItem("admintoken");
    const adminExpiry = localStorage.getItem("admin_expiry");

    if (savedAdminToken && savedAdmin && adminExpiry) {
      if (now > parseInt(adminExpiry)) {
        adminLogout(); // 期限切れならサーバー含めログアウト
      } else {
        setAdmin(JSON.parse(savedAdmin));
        setToken(savedAdminToken);
      }
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