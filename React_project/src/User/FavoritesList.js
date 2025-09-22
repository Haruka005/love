// React本体と、状態管理に使う useState を読み込む
import React, { useState } from "react";

// React Router の useNavigate を読み込むことで、ページ遷移ができるようになる
import { useNavigate } from "react-router-dom";

// このファイルで定義するコンポーネントの名前は FavoritesList
function FavoritesList() {
  // ページ遷移に使う関数。navigate("/URL") で指定したページに移動できる
  const navigate = useNavigate();

  // 表示するカテゴリ（"restaurant" または "event"）を保存する状態変数
  const [category, setCategory] = useState("restaurant"); // 初期値は "restaurant"

  // お気に入りデータを保存する状態変数（初期値として4件登録）
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      type: "restaurant", // 種類（飲食店）
      name: "びくどん", // 店名
      image: "🍴", // 絵文字アイコン
      detail: "びくどんは洋食レストランです。", // 詳細説明
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

  // 現在のページ番号を保存する状態変数（今はダミー構造）
  const [page, setPage] = useState(1);

  // 詳細を表示するアイテムのID（nullなら何も展開されていない）
  const [expandedId, setExpandedId] = useState(null);

  // 選択されたカテゴリに一致するデータだけを抽出する
  const filtered = favorites.filter((item) => item.type === category);

  // お気に入り解除処理（ハートボタンを押すと削除）
  const removeFavorite = (id) => {
    // IDが一致しないものだけを残して更新する
    setFavorites(favorites.filter((item) => item.id !== id));

    // 展開中のアイテムを削除した場合は詳細表示を閉じる
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

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
      <h2 style={{ textAlign: "center", marginTop: "0" }}>お気に入り一覧</h2>

      {/* カテゴリ切り替えボタン（イベント／飲食店） */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        {/* 飲食店ボタン */}
        <button
          onClick={() => setCategory("restaurant")}
          style={{
            padding: "12px 24px",
            fontSize: "40px",
            marginRight: "10px",
            borderRadius: "8px",
            backgroundColor: category === "restaurant" ? "#c2c9d1ff" : "#d7dce1ff",
            color: "#010101ff",
            border: "none",
            cursor: "pointer",
          }}
        >
          飲食店
        </button>

        {/* イベントボタン */}
        <button
          onClick={() => setCategory("event")}
          style={{
            padding: "12px 24px",
            fontSize: "40px",
            borderRadius: "8px",
            backgroundColor: category === "event" ? "#c2c9d1ff" : "#d7dce1ff",
            color: "#0b0b0bff",
            border: "none",
            cursor: "pointer",
          }}
        >
          イベント
        </button>
      </div>

      {/* お気に入りリストの表示（カテゴリに一致するものだけ） */}
      {filtered.map((item) => (
        <div
          key={item.id} // Reactが要素を識別するための一意なキー
          style={{
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {/* タイトル部分（クリックで詳細を開閉） */}
          <div
            onClick={() =>
              setExpandedId(expandedId === item.id ? null : item.id)
            }
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            {/* アイコンと店名／イベント名 */}
            <span>{item.image} {item.name}</span>

            {/* お気に入り解除ボタン（ハート） */}
            <button onClick={() => removeFavorite(item.id)}>❤️解除</button>
          </div>

          {/* 詳細表示（展開されている場合のみ） */}
          {expandedId === item.id && (
            <div style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
              {/* 仮画像（灰色の四角）を表示 */}
              <div
                style={{
                  width: "100%",
                  height: "150px",
                  backgroundColor: "#ddd",
                  borderRadius: "4px",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  color: "#666",
                }}
              >
                画像（仮）
              </div>

              {/* 詳細テキストの表示 */}
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
export default FavoritesList;