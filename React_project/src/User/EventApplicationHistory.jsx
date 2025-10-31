//イベント申請履歴
// React本体と、状態管理に使う useState を読み込む
import React, { useState } from "react";

// React Router の useNavigate を読み込むことで、ページ遷移ができるようになる
import { useNavigate } from "react-router-dom";

// このファイルで定義するコンポーネントの名前は EventApplicationHistory
export default function EventApplicationHistory() {
  // ページ遷移に使う関数。navigate("/URL") で指定したページに移動できる
  const navigate = useNavigate();

  // 展開されているイベントのIDを保存する状態変数（nullなら何も開いていない）
  const [expandedId, setExpandedId] = useState(null);

   // ページ番号の状態を追加
    const [page, setPage] = useState(1);

  // 表示するイベント申請履歴のデータ（仮のデータ）
  const events = [
    {
      id: 1,
      title: "タイトルA",
      date: "@@年@@月@@日", // 日付は仮の形式
      description: "このイベントは地域の交流を目的としたものです。",
    },
    {
      id: 2,
      title: "タイトルB",
      date: "@@年@@月@@日",
      description: "夏祭りのステージイベントです。",
    },
    {
      id: 3,
      title: "タイトルC",
      date: "@@年@@月@@日",
      description: "花火大会の運営に関する申請です。",
    },
  ];

  // JSX（画面に表示する内容）を return で返す
  return (
    // 全体を <div> で囲むことで、複数の要素をまとめて表示できる
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "500px", margin: "0 auto", position: "relative" }}>
      
      {/* ✕ 閉じるボタン（画面左上に固定表示） */}
      <button
        onClick={() => navigate("/MyPage")} // マイページに戻る
        style={{
          position: "absolute", // 画面の左上に固定配置
          top: "10px",
          left: "10px",
          backgroundColor: "#eee", // 背景色（薄いグレー）
          color: "#333", // 文字色
          border: "none", // 枠線なし
          borderRadius: "50%", // 丸型にする
          width: "40px",
          height: "40px",
          fontSize: "20px",
          cursor: "pointer", // マウスカーソルをポインターに
        }}
      >
        ✕
      </button>

      {/* ページタイトル */}
      <h2 style={{ textAlign: "center", marginTop: "0" }}>イベント申請確認履歴</h2>

      {/* イベントカードの一覧表示 */}
      {events.map((event) => (
        <div
          key={event.id} // Reactが要素を識別するための一意なキー
          style={{
            border: "1px solid #ccc", // 枠線
            borderRadius: "6px", // 角丸
            padding: "10px", // 内側余白
            marginBottom: "10px", // 下の余白
            backgroundColor: "#f9f9f9", // 背景色
          }}
        >
          {/* タイトル部分（クリックで詳細を開閉） */}
          <div
            onClick={() => setExpandedId(expandedId === event.id ? null : event.id)} // 同じIDなら閉じる、違うIDなら開く
            style={{
              cursor: "pointer", // マウスカーソルをポインターに
              fontWeight: "bold", // 太字
              fontSize: "16px",
              marginBottom: "5px",
            }}
          >
            {event.title}
          </div>

          {/* 詳細表示（展開されている場合のみ） */}
          {expandedId === event.id && (
            <div style={{ fontSize: "14px", color: "#555" }}>
              {/* 開催日 */}
              <p>開催日：{event.date}</p>

              {/* 仮画像（灰色の四角） */}
              <div
                style={{
                  width: "100%",
                  height: "120px",
                  backgroundColor: "#ddd",
                  borderRadius: "4px",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                }}
              >
                画像（仮）
              </div>

              {/* 説明文 */}
              <p>{event.description}</p>
            </div>
          )}
        </div>
      ))}
 {/* ページ送り（今はダミー構造） */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {/* 前のページボタン（1ページ目なら無効） */}
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          前のページ
        </button>

        {/* 現在のページ番号表示 */}
        <span style={{ margin: "0 10px" }}>ページ {page}</span>

        {/* 次のページボタン */}
        <button onClick={() => setPage(page + 1)}>次のページ</button>
      </div>
    </div>
  );
}