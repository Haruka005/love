// React本体と、状態管理用の useState を読み込み
import React, { useState } from "react";

// お気に入り一覧画面のコンポーネント
function FavoritesList() {
  // 表示するカテゴリ（"restaurant" または "event"）を管理
  const [category, setCategory] = useState("restaurant");

  // お気に入りデータを管理（初期値として4件登録）
  const [favorites, setFavorites] = useState([
    { id: 1, type: "restaurant", name: "びくどん", image: "🍴" },
    { id: 2, type: "event", name: "満点花火", image: "🎆" },
    { id: 3, type: "restaurant", name: "かつや", image: "🍚" },
    { id: 4, type: "event", name: "どこかの花火大会", image: "🎆" },
  ]);

  // 現在のページ番号（ダミー）を管理
  const [page, setPage] = useState(1);

  // 選択されたカテゴリに一致するデータだけを抽出
  const filtered = favorites.filter((item) => item.type === category);

  // お気に入り解除（ハートアイコンを押すと削除）
  const removeFavorite = (id) => {
    // 指定されたID以外のデータだけ残す
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {/* 画面タイトル */}
      <h2>お気に入り一覧</h2>

      {/* カテゴリ切替ボタン（直接スタイルを指定） */}
      <div style={{ marginBottom: "20px" }}>
        {/* 飲食店ボタン（青くて大きめ） */}
        <button
          onClick={() => setCategory("restaurant")}
          style={{
            padding: "12px 24px",       // 内側の余白（縦横）
            fontSize: "40px",           // 文字サイズ
            marginRight: "10px",        // ボタン間の余白
            borderRadius: "8px",        // 角丸
           // backgroundColor: "#007bff", // 背景色（青）
            color: "#010101ff",              // 文字色（白）
            backgroundColor: category === "restaurant" ? "#c2c9d1ff" : "#d7dce1ff", // 状態によって色を変える

            border: "none",             // 枠線なし
            cursor: "pointer",          // ホバー時にポインター表示
          }}
        >
          飲食店
        </button>

        {/* イベントボタン（緑で大きめ） */}
        <button
          onClick={() => setCategory("event")}
          style={{
            padding: "12px 24px",
            fontSize: "40px",
            borderRadius: "8px",
            //backgroundColor: "#28a745", // 背景色（緑）
             backgroundColor: category === "event" ? "#c2c9d1ff" : "#d7dce1ff", // 状態によって色を変える
            color: "#0b0b0bff",
            border: "none",
            cursor: "pointer",
          }}
        >
          イベント
        </button>
      </div>

      {/* お気に入りリストの表示 */}
      {filtered.map((item) => (
        <div
          key={item.id} // 一意のキー（Reactの最適化用）
          style={{
            display: "flex", // 横並び
            alignItems: "center", // 垂直方向中央揃え
            justifyContent: "space-between", // 両端揃え
            border: "1px solid #ccc", // 枠線
            padding: "10px", // 内側余白
            marginBottom: "10px", // 下の余白
            borderRadius: "6px", // 角丸
            backgroundColor: "#f9f9f9", // 背景色
          }}
        >
          {/* 店名やイベント名＋絵文字 */}
          <span>{item.image} {item.name}</span>

          {/* ハートアイコン（解除ボタン） */}
          <button onClick={() => removeFavorite(item.id)}>❤️解除</button>
        </div>
      ))}

      {/* ページ送り（ダミー構造） */}
      <div style={{ marginTop: "20px" }}>
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
export default FavoritesList;