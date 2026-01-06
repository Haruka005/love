import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.js";

function Header() {
  // ハンバーガーメニューの開閉状態を保持
  const [isOpen, setIsOpen] = useState(false);

  // Contextからログイン情報を取得
  const { user, isLoggedIn } = useAuth();

  return (
    <header
      style={{
        backgroundColor: "#fff",
        padding: "10px 20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* ヘッダー内部を左右に配置するために flex を使用 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* サイトタイトル */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          Loveりべつ
        </h1>

        {/* ログイン状態の表示 */}
        <div style={{ fontSize: "14px", color: "#333", marginRight: "20px" }}>
          {isLoggedIn ? (
            <span>👹 {user?.name} さん | ログイン中</span>
          ) : (
            <span>未ログイン</span>
          )}
        </div>

        {/* ------------------ ハンバーガーメニュー（スマホ用） ------------------ */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            fontSize: "32px",
            background: "none",
            border: "none",
            color: "#000",
            cursor: "pointer",
          }}
          aria-label="メニューを開く"
        >
          ≡
        </button>
      </div>

      {/* isOpen が true のときだけメニューを表示する */}
      {isOpen && (
        <ul
          style={{
            position: "absolute",
            top: "50px",
            right: "10px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            listStyle: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            width: "200px",
            zIndex: 1000,
          }}
        >
          <li><Link to="/">ホーム</Link></li>
          <li><Link to="/login">ログイン</Link></li>
          <li><Link to="/signup">サインアップ</Link></li>
          <li><Link to="/MyPage">マイページ</Link></li>
          <li><Link to="/ReportForm">問い合わせ・通報</Link></li>

        </ul>
      )}
    </header>
  );
}

export default Header;