import React, { useState } from "react";
import { Link } from "react-router-dom";

// 画像をインポート
import oniIcon from "./images/onioni.png";

import GetEvents from "./components/GetEvents";
import UpComingEvents from "./components/UpComingEvents";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GetRestaurants from "./components/GetRestaurants";
import HeroSlider from "./components/HeroSlider";
import SiteDescription from "./components/SiteDescription";

export default function MainPage() {
  const [selectedGenre, setSelectedGenre] = useState("洋食");

  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="main-background" style={{ backgroundColor: "#fff", overflowX: "hidden" }}>
      {/* ヘッダー */}
      <Header />

      {/* セクション間の隙間を埋めるコンテナ：lineHeight: 0 で微細な隙間を排除 */}
      <div style={{ display: "flex", flexDirection: "column", width: "100%", lineHeight: 0 }}>
        
        {/* ヒーローエリア */}
        <div style={{ width: "100%", margin: 0, padding: 0 }}>
          <HeroSlider />
        </div>

        {/* 各セクション：marginTop: "-1px" と lineHeight: "normal" をセットで適用 */}
        <div style={{ marginTop: "-1px", lineHeight: "normal" }}>
          <SiteDescription />
        </div>

        <div style={{ marginTop: "-1px", lineHeight: "normal" }}>
          <UpComingEvents />
        </div>

        <div style={{ marginTop: "-1px", lineHeight: "normal" }}>
          <GetEvents />
        </div>

        <div style={{ marginTop: "-1px", lineHeight: "normal" }}>
          <GetRestaurants />
        </div>

        {/* 会員機能 */}
        <section style={{ 
          margin: "0", 
          padding: "60px 20px", 
          textAlign: "center", 
          backgroundColor: "#fff",
          marginTop: "-1px",
          lineHeight: "normal"
        }}>
          <h2 style={{ marginBottom: "30px", fontSize: "1.8rem" }}>会員機能</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
            gap: "20px",
            maxWidth: "800px",
            margin: "0 auto"
          }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                backgroundColor: "#f9f9f9",
                border: "1px solid #eee",
                borderRadius: "12px",
                height: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#888",
                fontSize: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}>
                コンテンツ未定
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* --- 追従する鬼のボタン --- */}
      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
        title="トップに戻る"
      >
        <img 
          src={oniIcon} 
          alt="トップに戻る" 
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "contain",
            display: "block", // 画像下の謎の隙間を消す
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))"
          }} 
        />
      </button>

      <Footer />
    </div>
  );
}