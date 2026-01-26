// ログイン画面
import React, { useState } from "react";   // Reactの中からuseStateっていう便利機能を取りだして使うよっていう宣言
import { useNavigate } from 'react-router-dom';
// ▼ パスを ../../ に修正しました
import { useAuth } from "../../contexts/AuthContext"; 

// APIのベースURLを調整（末尾の /api 重複を防止する共通ロジック）
const getBaseApiUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
  // すでに /api で終わっていればそのまま、そうでなければ付与する
  return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

const API_BASE = getBaseApiUrl();

export default function Login() {    // 外に持って行ってOKなLoginっていう名前の部品作るよっていう宣言
  const [email, setEmail] = useState('');  // emailっていう変数用意して最初は空にしとく、メールの内容をリアルタイムで保存できる
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { login } = useAuth();

  const exitButton = {
    padding: '8px 20px', 
    fontSize: '0.9rem',
    fontWeight: '500',
    backgroundColor: '#ffffff',
    color: '#f93d5d', 
    border: '1px solid #f93d5d', 
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'inline-block', 
    margin: '0 auto', 
    whiteSpace: 'nowrap',    
    minWidth: '120px',       
  };

  const buttonWrapperStyle = {
    marginTop: "30px",
    display: "flex",          
    justifyContent: "center", 
    width: "100%",
    textAlign: "center", 
  };

  const handleSubmit = async (e) => {   // 送信操作がされたら次の処理を実行
    e.preventDefault(); // ページのリロードを防ぐ
    setError('');

    try {
      // 安全に構築されたURLを使用 (/api/login になるように)
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      // デバッグ用ログ
      console.log("Login Response Status:", response.status); 

      if (response.ok) {
        // トークンをlocalstorageに保存
        localStorage.setItem('usertoken', data.token);

        // AuthContextの状態を更新
        login({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        }, data.token);

        // ログイン成功後、マイページへ
        navigate('/MyPage');
      } else {
        // サーバーからのエラーメッセージを表示
        setError(data.message || 'ログインに失敗しました。メールアドレスかパスワードが正しくありません。');
      }
    } catch (err) {
      console.error('通信エラー:', err);
      setError('サーバーに接続できませんでした。ネットワーク状況を確認してください。');
    }
  };
  
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>ログイン</h2> 
        <input 
          type="email"    // メールアドレス専用
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required        // 必須入力
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        
        {error && <p style={{ color: "red", fontSize: "0.9rem", marginBottom: "15px" }}>{error}</p>}
        
        <button 
          type="submit" 
          style={{ 
            width: "100%", 
            padding: "10px", 
            backgroundColor: "#f93d5d", 
            color: "white", 
            border: "none", 
            borderRadius: "4px", 
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          ログイン
        </button>

        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <span 
            onClick={() => navigate('/ForgotPassword')}
            style={{
              fontSize: '0.85rem',
              color: '#666',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            パスワードをお忘れですか？
          </span>
        </div>

        <div style={buttonWrapperStyle}>
          <button
            type="button"
            style={exitButton}
            onClick={() => navigate("/")} 
          >
            TOPページへ
          </button>
        </div>
      </form>
    </div>
  );
}

