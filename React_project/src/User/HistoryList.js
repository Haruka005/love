// React本体と、状態管理に使う useState を読み込む
import React, { useState } from "react";

// React Router の useNavigate を読み込むことで、ページ遷移ができるようになる
import { useNavigate } from "react-router-dom";

// 閲覧履歴一覧のメインコンポーネント
function HistoryList() {
  // ページ遷移に使う関数。navigate("/URL") で指定したページに移動できる
  const navigate = useNavigate();

  // 表示するカテゴリ（"event" または "restaurant"）を保存する状態変数
  const [category, setCategory] = useState("event"); // 初期値は "event"

  // 閲覧履歴データ（仮のデータ）を保存する状態変数
  const [history] = useState([
    {
      id: 1,
      type: "restaurant",
      name: "びくどん",
      image: "🍴",
      detail: "びくどんは洋食レストランです。",
    },
    {
      id: 2,
      type: "event",
      name: "満点花火",
      image: "🎆",
      detail: "満点花火は夏の夜空を彩るイベントです。",
    },
    {
      id: 3,
      type: "restaurant",
      name: "かつや",
      image: "🍚",
      detail: "かつやは定食屋で、カツ丼が人気です。",
    },
    {
      id: 4,
      type: "event",
      name: "どこかの花火大会",
      image: "🎆",
      detail: "地域で開催される花火大会です。",
    },
  ]);

  // 現在のページ番号（今はダミー構造）を保存する状態変数
  const [page, setPage] = useState(1);

  // 詳細を表示するアイテムのID（nullなら何も展開されていない）
  const [expandedId, setExpandedId] = useState(null);

  // 選択されたカテゴリに一致する履歴だけを抽出する
  const filtered = history.filter((item) => item.type === category);

  // JSX（画面に表示する内容）を return で返す
  return (
    // 全体を <div> で囲むことで、複数の要素をまとめて表示できる
    <div style={{ padding: "20px", fontFamily: "sans-serif", position: "relative" }}>
      
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
      <h2 style={{ textAlign: "center", marginTop: "0" }}>閲覧履歴一覧</h2>

      {/* カテゴリ切り替えボタン（イベント／飲食店） */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        {/* イベントボタン */}
        <button
          onClick={() => setCategory("event")} // イベントを選択したら状態を更新
          style={{
            padding: "12px 24px",
            fontSize: "40px",
            marginRight: "10px",
            borderRadius: "8px",
            backgroundColor: category === "event" ? "#c2c9d1ff" : "#d7dce1ff", // 選択中なら濃い色
            color: "#0b0b0bff",
            border: "none",
            cursor: "pointer",
          }}
        >
          イベント
        </button>

        {/* 飲食店ボタン */}
        <button
          onClick={() => setCategory("restaurant")} // 飲食店を選択したら状態を更新
          style={{
            padding: "12px 24px",
            fontSize: "40px",
            borderRadius: "8px",
            backgroundColor: category === "restaurant" ? "#c2c9d1ff" : "#d7dce1ff",
            color: "#010101ff",
            border: "none",
            cursor: "pointer",
          }}
        >
          飲食店
        </button>
      </div>

      {/* 閲覧履歴カードの一覧表示 */}
      {filtered.map((item) => (
        <div
          key={item.id} // Reactが要素を識別するための一意なキー
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
            onClick={() =>
              setExpandedId(expandedId === item.id ? null : item.id) // 同じIDなら閉じる、違うIDなら開く
            }
            style={{
              display: "flex", // 横並び
              alignItems: "center", // 垂直方向中央揃え
              justifyContent: "flex-start", // 左寄せ
              gap: "10px", // アイコンと名前の間隔
              cursor: "pointer", // マウスカーソルをポインターに
            }}
          >
            <span>{item.image}</span> {/* 絵文字アイコン */}
            <span>{item.name}</span> {/* タイトル */}
          </div>

          {/* 詳細表示（展開されている場合のみ） */}
          {expandedId === item.id && (
            <div style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
              {/* 仮画像（灰色の四角） */}
              <div
                style={{
                  width: "100%", // 横幅いっぱい
                  height: "150px", // 高さ150px
                  backgroundColor: "#ddd", // 灰色の背景
                  borderRadius: "4px", // 少し角丸
                  marginBottom: "10px",
                  display: "flex", // 中央揃えのためにflexを使う
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  color: "#666",
                }}
              >
                画像（仮）{/* 後で本物の画像に差し替え可能 */}
              </div>

              {/* 詳細テキスト */}
              <p>{item.detail}</p>
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

// 他のファイルからこのコンポーネントを使えるようにする
export default HistoryList;