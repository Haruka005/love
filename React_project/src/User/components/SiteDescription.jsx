import React from "react";

function SiteDescription() {
  return (
    <section
      style={{
        // 修正ポイント：上下のマージンを0にし、背景色を初期設定に。
        margin: "0",              
        padding: "60px 20px",    
        textAlign: "center",
        backgroundColor: "#f9f9f9", // 初期設定の背景色
        // 修正ポイント：borderRadiusがあると四隅に隙間が出るため、0にする
        borderRadius: "0", 
        width: "100%",
        display: "block",
        boxSizing: "border-box"
      }}
    >
      <h1
        style={{
          // 修正ポイント：スマホで見切れないようclamp（可変サイズ）を導入
          fontSize: "clamp(1.8rem, 10vw, 2.5rem)", 
          marginBottom: "30px",
          color: "white",
          WebkitTextStroke: "2px #f93d5d", 
          fontFamily: "'Mochiy Pop One', sans-serif",
          lineHeight: "1.3"
        }}
      >
        Ｗｈａｔ ｉｓ<br />
        Ｌｏｖｅ り べ つ ？？
      </h1>

      <p style={{ 
        // 修正ポイント：スマホで文字が大きすぎないよう調整
        fontSize: "clamp(0.95rem, 3.5vw, 1.1rem)", 
        lineHeight: "1.8", 
        color: "#444",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "0 10px",
        wordBreak: "keep-all", // 日本語の不自然な改行を防ぐ
        overflowWrap: "anywhere"
      }}>
        登別の美味しいグルメと楽しいイベントを探そう！<br />
        お店の詳細や予算、エリアも一目でチェック。<br />
        イベントは月ごとに一覧で確認でき、最新情報も随時更新中。<br />
        登別の魅力を、このサイトでまるごと体験しよう！
      </p>
    </section>
  );
}

export default SiteDescription;