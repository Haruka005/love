import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.js";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();

  //メニュー項目の共通スタイル
  const linkStyle = {
    display: "flex",
    alignItems: "center",
    padding: "15px 20px",
    textDecoration: "none",
    color: "#444",
    fontSize: "0.95rem",
    fontWeight: "600",
    borderBottom: "1px solid #f5f5f5",
    transition: "background-color 0.2s",
  };

  //メニューを閉じる処理
  const closeMenu = () => setIsOpen(false);

  return (
    <header
      style={{
        backgroundColor: "#fff",
        padding: "0 20px",
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "1px solid #eee", 
        position: "sticky",
        top: 0,
        zIndex: 3000,
        fontFamily: '"Zen Maru Gothic", sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        {/*サイトロゴ*/}
        <Link to="/" style={{ textDecoration: "none" }} onClick={closeMenu}>
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: "900",
              color: "#F93D5D",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            Loveりべつ
          </h1>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {/* ログイン情報 */}
          {isLoggedIn && (
            <div style={{ 
              fontSize: "0.8rem", 
              color: "#F93D5D", 
              backgroundColor: "#fff0f2", 
              padding: "5px 12px", 
              borderRadius: "20px",
              fontWeight: "bold",
            }}>
              👹 {user?.name}
            </div>
          )}

          {/*ハンバーガーボタン*/}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              width: "45px",
              height: "45px",
              backgroundColor: isOpen ? "#444" : "#F93D5D",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              transition: "all 0.3s ease",
              boxShadow: "none", 
              padding: 0,
            }}
          >
            <div style={{ 
              width: "22px", height: "2px", backgroundColor: "#fff", 
              transition: "0.3s", transform: isOpen ? "rotate(45deg) translate(5px, 5px)" : "none" 
            }} />
            <div style={{ 
              width: "22px", height: "2px", backgroundColor: "#fff", 
              transition: "0.3s", opacity: isOpen ? 0 : 1 
            }} />
            <div style={{ 
              width: "22px", height: "2px", backgroundColor: "#fff", 
              transition: "0.3s", transform: isOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" 
            }} />
          </button>
        </div>
      </div>

      {/*ドロップダウンメニュー*/}
      {isOpen && (
        <>
          <div
            onClick={closeMenu}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.1)", 
              zIndex: 3001,
            }}
          />

          <nav
            style={{
              position: "absolute",
              top: "80px",
              right: "20px",
              width: "240px",
              backgroundColor: "#fff",
              borderRadius: "20px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)", 
              zIndex: 3002,
              overflow: "hidden",
              border: "1px solid #eee", 
              animation: "headerSlideDown 0.3s ease-out forwards",
            }}
          >
            <div style={{ padding: "15px 20px", backgroundColor: "#fdfdfd", borderBottom: "1px solid #eee" }}>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#999", fontWeight: "bold" }}>MENU</p>
            </div>
            
            <Link to="/" style={linkStyle} onClick={closeMenu}>
              <span style={{ marginRight: "10px" }}>🏠</span> ホーム
            </Link>
            
            <Link to="/MyPage" style={linkStyle} onClick={closeMenu}>
              <span style={{ marginRight: "10px" }}>👤</span> マイページ
            </Link>

            {!isLoggedIn ? (
              <>
                <Link to="/login" style={linkStyle} onClick={closeMenu}>
                  <span style={{ marginRight: "10px" }}>🔑</span> ログイン
                </Link>
                <Link to="/signup" style={linkStyle} onClick={closeMenu}>
                  <span style={{ marginRight: "10px" }}>📝</span> 新規登録
                </Link>
              </>
            ) : (
              <div style={{ ...linkStyle, color: "#999", fontSize: "0.8rem", backgroundColor: "#fafafa" }}>
                ログイン中: {user?.name}
              </div>
            )}

            <Link to="/ReportForm" style={{ ...linkStyle, borderBottom: "none" }} onClick={closeMenu}>
              <span style={{ marginRight: "10px" }}>📩</span> お問い合わせ
            </Link>

            <div style={{ height: "6px", backgroundColor: "#F93D5D" }} />
          </nav>
        </>
      )}

      <style>{`
        @keyframes headerSlideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}

export default Header;