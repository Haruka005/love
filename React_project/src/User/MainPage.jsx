// メインページ

import React from "react";

// リンク切り替え用のコンポーネントを読み込む（ページ遷移を行う）
import { Link } from "react-router-dom";
import GetEvents from "./components/GetEvents";
import UpComingEvents from "./components/UpComingEvets";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GetRestaurants from "./components/GetRestaurants"; 
import HeroSlider from "./components/HeroSlider";
import SiteDescription from "./components/SiteDescription";

// -------------------------------------------------

// ここからが画面（コンポーネント）の定義
export default function MainPage() {

  // cardStyle: イベントや店舗カードで使う共通のスタイル（オブジェクト）
  const cardStyle = {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  };

  // ------------------JSX↓------------------
  return (
    // ここから画面全体（コンテナ）
    <div style={{ fontFamily: "sans-serif", color: "#000", backgroundColor: "#f5f5f5" }}>

      {/* ------------------ ヘッダー ------------------ */}
      <Header />

      {/* ------------------ メインコンテンツ ------------------ */}
      <main style={{ padding: "20px" }}>

        <section style={{ marginBottom: "30px", textAlign: "center" }}>
          {/* これでメインの画像のサイズいじれる */}
          <div style={{
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto 20px",
            height: "500px",
            //backgroundColor: "#ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px"
          }}>
            {/* TOP（画像差し替えるここ） */}
            <img
              src="/images/229.png"
              alt="登別トップ画面"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "0px"
              }}
            />
          </div>

          {/* ウェルカムテキスト */}
          <h2 style={{ fontSize: "50px", fontWeight: "bold", color: "#000" }}>ようこそ登別へ</h2>
        </section>

        {/* ---------- 直近イベント（カード） ---------- */}
        <UpComingEvents />

        {/* ---------- イベント一覧 ---------- */}
        <GetEvents />

        {/* ---------- 会員機能（仮の領域） ---------- */}
        <section style={{ marginBottom: "40px", textAlign: "center" }}>
          <h3 style={{ fontSize: "20px", marginBottom: "20px", color: "#333" }}>会員機能</h3>
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
      </main>

      {/* ------------------ ヒーローエリア表示 ------------------ */}
      <HeroSlider />

      {/* ------------------ サイト説明 ------------------ */}
      <SiteDescription />

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