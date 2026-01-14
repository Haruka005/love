import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.js";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();

  return (
    <header style={{ height: "60px", display: "flex", alignItems: "center" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        maxWidth: "1200px", /* ヘッダーの中身が広がりすぎないよう制限 */
        margin: "0 auto",
        padding: "0 15px"
      }}>
        
        {/* タイトル：no-splitクラスで改行を阻止 */}
        <h1 className="header-title no-split">
          Loveりべつ
        </h1>

        {/* 右側のエリア（ログイン情報とボタン） */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          
          {isLoggedIn && (
            <div className="user-status no-split">
              <span>👹 {user?.name} さん</span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              fontSize: "28px",
              background: "none",
              border: "none",
              color: "#000",
              cursor: "pointer",
              padding: "5px",
              lineHeight: 1
            }}
          >
            ≡
          </button>
        </div>
      </div>

      {/* メニュー部分は変更なし */}
      {isOpen && (
        <ul style={{
          position: "absolute", top: "60px", right: "10px", backgroundColor: "#fff",
          border: "1px solid #ccc", borderRadius: "8px", padding: "10px", listStyle: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)", width: "200px", zIndex: 3001
        }}>
          <li><Link to="/" onClick={() => setIsOpen(false)}>ホーム</Link></li>
          <li><Link to="/login" onClick={() => setIsOpen(false)}>ログイン</Link></li>
          <li><Link to="/signup" onClick={() => setIsOpen(false)}>サインアップ</Link></li>
          <li><Link to="/MyPage" onClick={() => setIsOpen(false)}>マイページ</Link></li>
          <li><Link to="/ReportForm" onClick={() => setIsOpen(false)}>問い合わせ・通報</Link></li>
        </ul>
      )}
    </header>
  );
}

export default Header;