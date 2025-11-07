//行ったことあるところ反映

import React, { useState } from "react";

// Leaflet（地図ライブラリ）のコンポーネントを読み込む
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

// 地図表示に必要なCSSを読み込む（これがないと地図が表示されない）
import "leaflet/dist/leaflet.css";

// React Router のページ遷移機能を読み込む（✕ボタンでマイページに戻るため）
import { useNavigate } from "react-router-dom";

// 地図を指定された位置に移動するための補助コンポーネント
function FlyToLocation({ lat, lng }) {
  const map = useMap(); // 現在表示されている地図インスタンスを取得

  // 緯度・経度が変更されたときに地図を移動する
  React.useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 16); // 指定された座標にズーム付きで移動
    }
  }, [lat, lng, map]); // lat/lng/map のいずれかが変わったら実行される

  return null; // このコンポーネント自体は画面に何も表示しない
}

// 店舗一覧画面のメインコンポーネント
export default function VisitList() {
  const navigate = useNavigate(); // ✕ボタンでページ遷移するための関数

  // 検索キーワード（店名や住所）を保存する状態
  const [searchTerm, setSearchTerm] = useState("");

  // ジャンル絞り込み（洋食・定食・デザートなど）を保存する状態
  const [genreFilter, setGenreFilter] = useState("");

  // 展開されている店舗のインデックス（何番目の店舗か）を保存する状態
  const [expandedIndex, setExpandedIndex] = useState(null);

  // 地図を移動するための座標（緯度・経度）を保存する状態
  const [flyToCoords, setFlyToCoords] = useState(null);

  // ページ番号の状態を追加
  const [page, setPage] = useState(1);


  // 店舗データ（仮のデータ）
  const stores = [
    {
      name: "びくどん",
      genre: "洋食",
      address: "北海道室蘭市東町1丁目3",
      lat: 42.342621,
      lng: 141.018801,
    },
    {
      name: "すきや",
      genre: "定食",
      address: "北海道登別",
      lat: 42.415,
      lng: 141.102,
    },
    {
      name: "クレープ屋",
      genre: "デザート",
      address: "北海道登別",
      lat: 42.418,
      lng: 141.108,
    },
  ];

  // 検索キーワードとジャンルで店舗を絞り込む
  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.includes(searchTerm) || store.address.includes(searchTerm); // 店名または住所に検索語が含まれるか
    const matchesGenre = genreFilter === "" || store.genre === genreFilter; // ジャンルが一致するか（空ならすべて）
    return matchesSearch && matchesGenre; // 両方の条件を満たす店舗だけ表示
  });

  // JSX（画面に表示する内容）を返す
  return (
    // ✕ボタンを固定表示するために position: "relative" を追加
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
      <h2 style={{ textAlign: "center", marginTop: "0" }}>来店店舗一覧</h2>

      {/* 検索バー（店名や住所で検索） */}
      <input
        type="text"
        placeholder="店名・住所で検索"
        value={searchTerm} // 入力された文字列を表示
        onChange={(e) => setSearchTerm(e.target.value)} // 入力が変わるたびに状態を更新
        style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
      />

      {/* ジャンル絞り込みのセレクトボックス */}
      <select
        value={genreFilter} // 選択されたジャンルを表示
        onChange={(e) => setGenreFilter(e.target.value)} // 選択が変わるたびに状態を更新
        style={{ padding: "8px", width: "100%", marginBottom: "20px" }}
      >
        <option value="">すべてのジャンル</option>
        <option value="洋食">洋食</option>
        <option value="定食">定食</option>
        <option value="デザート">デザート</option>
      </select>

      {/* 地図表示（Leaflet）openstreetmap */}
      <MapContainer center={[42.415, 141.106]} zoom={14} style={{ height: "300px", marginBottom: "20px" }}>
        {/* 地図の背景画像（OpenStreetMap） */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 地図を移動するためのコンポーネント（座標がセットされていれば移動） */}
        {flyToCoords && <FlyToLocation lat={flyToCoords.lat} lng={flyToCoords.lng} />}

        {/* 店舗の位置にピンを表示 */}
        {filteredStores.map((store, index) => (
          <Marker key={index} position={[store.lat, store.lng]}>
            <Popup>{store.name}</Popup> {/* ピンをクリックすると店名を表示 */}
          </Marker>
        ))}
      </MapContainer>

      {/* 店舗一覧（クリックで詳細表示＋地図移動） */}
      {filteredStores.map((store, index) => (
        <div
          key={index}
          onClick={() => {
            // 展開されている店舗なら閉じる、そうでなければ開く
            setExpandedIndex(index === expandedIndex ? null : index);

            // 地図をこの店舗の位置に移動する
            setFlyToCoords({ lat: store.lat, lng: store.lng });
          }}
          style={{
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#f9f9f9",
            cursor: "pointer",
          }}
        >
          {/* 店名とジャンルの表示 */}
          <p><strong>店名:</strong> {store.name}</p>
          <p><strong>ジャンル:</strong> {store.genre}</p>

          {/* 詳細情報（展開されている場合のみ表示） */}
          {expandedIndex === index && (
            <div style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
              <p><strong>住所:</strong> {store.address}</p>
              <p>地図上の位置も確認できます</p>
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