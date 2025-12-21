import React, { useState } from "react";
import { Link } from "react-router-dom";

// 画像をインポート
import oniIcon from "./images/onioni.png";

import GetEvents from "./components/GetEvents";
import UpComingEvents from "./components/UpComingEvets";
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
    <div className="main-background">
      {/* ヘッダー */}
      <Header />

      {/* ヒーローエリア */}
      <HeroSlider />

      {/* サイト説明 */}
      <SiteDescription />

      {/* 直近イベント */}
      <UpComingEvents />

      {/* イベント一覧 */}
      <GetEvents />

      {/* ジャンル別おすすめ飲食店 */}
      <GetRestaurants />

      {/* 会員機能（仮） */}
      <section style={{ marginBottom: "40px", textAlign: "center" }}>
        <h2>会員機能</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: "8px",
              height: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#555",
              fontSize: "16px"
            }}>
              コンテンツ未定
            </div>
          ))}
        </div>
      </section>

      {/* --- 追従する鬼のボタン --- */}
      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",    // スクロールしても固定
          bottom: "30px",       // 下から30px
          right: "20px",        // 右から20px
          width: "70px",        // 画像に合わせて少し大きく調整
          height: "70px",
          borderRadius: "50%",
          backgroundColor: "transparent", // 画像が丸いので背景は透明に
          border: "none",                 // 枠線を消してスッキリさせる
          cursor: "pointer",
          padding: 0,                     // 画像との余白をゼロにする
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,         // 一番手前に表示
          transition: "transform 0.2s",   // ホバー時の動き用
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"} // マウスを乗せた時に少し大きく
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
            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" // 画像に影をつけて浮かせる
          }} 
        />
      </button>

      {/* フッター */}
      <Footer />
    </div>
  );
}