//メインページ

import React, { useState } from "react";

// リンク切り替え用のコンポーネントを読み込む（ページ遷移を行う）
import { Link } from "react-router-dom";
import GetEvents from "./components/GetEvents";
import UpComingEvents from "./components/UpComingEvets";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GetRestaurants from "./components/GetRestaurants"; 
import HeroSlider from "./components/HeroSlider";



// -------------------------------------------------

// ここからが画面（コンポーネント）の定義
export default function MainPage() {

  // selectedGenre: 洋食／定食／デザート など、選択中の飲食ジャンルを保持
  // 初期は "洋食"
  const [selectedGenre, setSelectedGenre] = useState("洋食");


  // ------------------JSX↓------------------
  return (
    // ここから画面全体（コンテナ）
    <div className="main-background">

      {/* ------------------ ヘッダー ------------------ */}
       <Header />
      
      {/* ------------------ヒーローエリア表示------------------ */}  
      <HeroSlider />

      {/* ---------- 直近イベント（カード） ---------- */}
      <UpComingEvents />


      {/* ---------- イベント一覧 ---------- */}
        <GetEvents />

      {/* ---------- ジャンル別おすすめ飲食店 ---------- */}
        <GetRestaurants />


      {/* ---------- 会員機能（仮の領域） ---------- */}
      <section style={{ marginBottom: "40px", textAlign: "center" }}>
        <h2>会員機能</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)", // 2列に並べる
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

      


      {/* ------------------ フッター ------------------ */}
      <Footer />
    </div>
  );
}
