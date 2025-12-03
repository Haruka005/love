import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // 💡 修正1: loading ステートを追加

  // ページリロード時に localStorage から復元
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserName = localStorage.getItem("userName"); 
    
    // トークンがない場合は、APIを叩く必要がないため、loadingをfalseにして即座に終了
    if (!savedToken) {
      setLoading(false);
      return;
    }

    setToken(savedToken);
    if(savedUserName){
      setUser({name: savedUserName});
    }

    const fetchUser = async () => {
        try {
          const res = await fetch("http://localhost:8000/api/me", {
            method: "GET",
            headers: {
                // サーバーがトークンを検証できるよう、Authorizationヘッダーで送る
                "Authorization": `Bearer ${savedToken}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            localStorage.setItem("userName", data.name); //最新のユーザー情報にキャッシュを更新
            setUser(data); 
          } else {
              // トークンが無効または期限切れの場合
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
    
    // トークンがあるかどうかに関わらず、非同期の確認処理を開始
    fetchUser();
    
  }, []); // 空の依存配列でリロード時のみ実行

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    //ログイン時にトークンとユーザー名を保存
    localStorage.removeItem("token");
    localStorage.setItem("userName", userData.name);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    //ログアウト時は両方のキャッシュを削除
    localStorage.removeItem("token");
    localStorage.removeItem("userName"); 
    
  };

  const isLoggedIn = !!user || !!token;

  return (
    <AuthContext.Provider 
        value={{ 
            user, 
            token, 
            login, 
            logout, 
            isLoggedIn,
            loading
        }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);