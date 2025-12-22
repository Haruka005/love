import React, { useState } from "react";
import { Link } from "react-router-dom";

import GetEvents from "./components/GetEvents";
import UpComingEvents from "./components/UpComingEvents";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GetRestaurants from "./components/GetRestaurants";
import HeroSlider from "./components/HeroSlider";
import SiteDescription from "./components/SiteDescription";

export default function MainPage() {
  const [selectedGenre, setSelectedGenre] = useState("洋食");

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

      {/* フッター */}
      <Footer />
    </div>
  );
}