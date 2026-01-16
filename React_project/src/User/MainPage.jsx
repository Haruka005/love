import React, { useState, useEffect } from "react";


// 画像をインポート
import oniIcon from "./images/onioni.png";

import GetEvents from "./components/GetEvents";
import UpComingEvents from "./components/UpComingEvents";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GetRestaurants from "./components/GetRestaurants";
import HeroSlider from "./components/HeroSlider";
import SiteDescription from "./components/SiteDescription";
import ViewHistory from "./components/ViewHistory";

export default function MainPage() {
  const [selectedGenre, setSelectedGenre] = useState("洋食");

  // 背景画像の設定とスクロール制御
  useEffect(() => {
    document.body.style.backgroundImage = "url('images/images.png')";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    return () => { document.body.style.backgroundImage = ""; };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0,
      behavior: "smooth"
    });
  };

  const recordClick = async (type, id) => {
    try {
      const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
      const logUrl = `/${type}s/${id}`; 

      await fetch(`${API_BASE}/analytics/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ url: logUrl }),
      });
    } catch (err) {
      console.error("Click logging error:", err);
    }
  };

  return (
    <>
      {/* 画面いっぱいに広がる固定ヘッダー */}
      <Header />

      {/* 中央寄せのメインコンテンツ */}
      <div className="main-background" style={{ overflowX: "hidden" }}>
        
        {/* ヘッダーの高さ分、全体を下げる */}
        <div style={{ display: "flex", flexDirection: "column", width: "100%", lineHeight: 0, paddingTop: "65px" }}>
          
          <div style={{ width: "100%", margin: 0, padding: 0 }}>
            <HeroSlider />
          </div>

          <div style={{ marginTop: "-1px", lineHeight: "normal" }}>
            <SiteDescription />
          </div>

          <div style={{ marginTop: "-1px", lineHeight: "normal" }}>
            <UpComingEvents onRecordClick={(id) => recordClick("event", id)} />
          </div>

          <div style={{ marginTop: "-1px", lineHeight: "normal" }}>
            <GetEvents onRecordClick={(id) => recordClick("event", id)} />
          </div>

          <div style={{ marginTop: "-1px", lineHeight: "normal" }}>
            <GetRestaurants onRecordClick={(id) => recordClick("restaurant", id)} />
          </div>

        {/*閲覧履歴*/}
        <div style={{ marginTop: "-1px", lineHeight: "normal" }}>
          <ViewHistory />
        </div>
      </div>

        <Footer />
      </div>

      {/* --- 追従する鬼のボタン (元の機能・スタイルそのまま) --- */}
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
          zIndex: 4000,
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
    </>
  );
}