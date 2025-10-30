//メインページ

import React, { useState } from "react";
// リンク切り替え用のコンポーネントを読み込む（ページ遷移を行う）
import { Link } from "react-router-dom";
import GetEvents from "./conponents/GetEvents";
import UpComingEvents from "./conponents/UpComingEvets";
import Header from "./conponents/Header";
import Footer from "./conponents/Footer";


// ---------------------- 表示データ（サンプル） ----------------------

// ジャンル別の飲食店データ（簡易サンプル）
const shopDataByGenre = {
  "洋食": [
    { title: "登別美味しい洋食" },
    { title: "洋風ダイニング登別" }
  ],
  "定食": [
    { title: "登別定食屋" },
    { title: "ソーダかもしれない食堂" }
  ],
  "デザート": [
    { title: "登別スイーツカフェ" },
    { title: "温泉プリン専門店" }
  ]
};



// -------------------------------------------------

// ここからが画面（コンポーネント）の定義
export default function MainPage() {

  // isOpen: ハンバーガーメニュー（右上の三本線）の開閉状態を保持する boolean
  // 初期は false（閉じている）→クリックtrue
  const [isOpen, setIsOpen] = useState(false);

  // selectedGenre: 洋食／定食／デザート など、選択中の飲食ジャンルを保持
  // 初期は "洋食"
  const [selectedGenre, setSelectedGenre] = useState("洋食");

  // selectedYear: 年の選択値（"2024" や "2025" の文字列で管理）
  // 年を増やす場合はセレクトに option を追加
  const [selectedYear, setSelectedYear] = useState("2025");

  // selectedMonth: 月の選択値（"01"〜"12" の文字列で管理）
  // 初期は "09"（9月）9月に作ったから
  const [selectedMonth, setSelectedMonth] = useState("09");

  // key: eventsByMonth オブジェクトのキー（"YYYY-MM"）を作成する
  const key = `${selectedYear}-${selectedMonth}`;

  // monthlyEvents: 選択中の年・月に対応するイベント配列を取得
  // 該当データがなければ空配列を使う（エラー回避のため）
  const monthlyEvents = eventsByMonth[key] || [];

  // cardStyle: イベントや店舗カードで使う共通のスタイル（オブジェクト）
  // JSX の style にそのまま渡せる
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
          }}
          >
            {/* TOP（画像差し替えるここ） */}
            <img
              src="/images/229.png"
              alt ="登別トップ画面"
              style={{
                width:"100%",
                height:"aouto",
                borderRadius:"0px"
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



        {/* ---------- ジャンル別おすすめ飲食店 ---------- */}
        <section style={{ marginBottom: "30px", textAlign: "center" }}>
          <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>ジャンル別おすすめ飲食店</h3>

          {/* ジャンル切替ボタン群 */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
            {["洋食", "定食", "デザート"].map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)} // クリックでジャンルを更新
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: selectedGenre === genre ? "2px solid #101010" : "1px solid #ccc",
                  backgroundColor: selectedGenre === genre ? "#e0f0ff" : "#fff",
                  fontWeight: selectedGenre === genre ? "bold" : "normal",
                  cursor: "pointer"
                }}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* 選択ジャンルに基づいた店舗カード表示 */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
            {(shopDataByGenre[selectedGenre] || []).map((shop, i) => (
              <div key={i} style={cardStyle}>
                {/* 仮画像領域（実際は画像URLを入れて <img> に差し替え可能） */}
                <div style={{
                  width: "100%",
                  height: "180px",
                  backgroundColor: "#ddd",
                  borderRadius: "6px",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <span style={{ color: "#888", fontSize: "16px" }}>画像挿入予定</span>
                </div>

                {/* 店舗名表示 */}
                <h4 style={{ fontWeight: "bold", fontSize: "18px" }}>{shop.title}</h4>
              </div>
            ))}
          </div>
        </section>


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


      {/* ------------------ フッター ------------------ */}
      <Footer />
    </div>
  );
}
