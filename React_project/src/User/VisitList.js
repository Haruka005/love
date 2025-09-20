import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// MapContainer, 地図全体を表示するコンテナ（地図の枠）
 //TileLayer,地図の背景（OpenStreetMapなどの地図画像）
 //Marker, 地図上のピン（店舗の位置を示す）
 //Popup,ピンをクリックしたときに表示される吹き出し（店名などを表示）
 

import "leaflet/dist/leaflet.css";

// 店舗一覧画面コンポーネント
export default function VisitList() {
  // 検索キーワードとジャンル絞り込みの状態
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null); // プルダウン展開用

  // 店舗データ（緯度・経度付き）
  const stores = [
    { name: "びくどん", genre: "洋食", address: "北海道室蘭市東町1丁目3", lat: 42.342621, lng: 141.018801},
    { name: "すきや", genre: "定食", address: "北海道登別", lat: 42.415, lng: 141.102 },
    { name: "クレープ屋", genre: "デザート", address: "北海道登別", lat: 42.418, lng: 141.108 },
  ];

  // 検索とジャンル絞り込みを適用
  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      // 店名に検索語が含まれているか
      store.name.includes(searchTerm) ||
      // 住所に検索語が含まれているか
      store.address.includes(searchTerm);
    const matchesGenre = genreFilter === "" || store.genre === genreFilter;
    // 両方の条件を満たす店舗だけを表示対象にする
    return matchesSearch && matchesGenre;
  });

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>来店店舗一覧</h2>

      {/* 検索バー */}
      <input
        type="text"
        placeholder="店名・住所で検索"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
      />

      {/* ジャンル絞り込み */}
      <select
        value={genreFilter}
        onChange={(e) => setGenreFilter(e.target.value)}
        style={{ padding: "8px", width: "100%", marginBottom: "20px" }}
      >
        <option value="">すべてのジャンル</option>
        <option value="洋食">洋食</option>
        <option value="定食">定食</option>
        <option value="デザート">デザート</option>
      </select>

      {/* 地図表示（Leaflet） */}
      <MapContainer center={[42.415, 141.106]} zoom={14} style={{ height: "300px", marginBottom: "20px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredStores.map((store, index) => (
          <Marker key={index} position={[store.lat, store.lng]}>
            <Popup>{store.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* 店舗一覧（クリックで詳細展開） */}
      {filteredStores.map((store, index) => (
        <div
          key={index}
          onClick={() => setExpandedIndex(index === expandedIndex ? null : index)}
          style={{
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#f9f9f9",
            cursor: "pointer",
          }}
        >
          <p><strong>店名:</strong> {store.name}</p>
          <p><strong>ジャンル:</strong> {store.genre}</p>

          {/* プルダウン詳細表示 */}
          {expandedIndex === index && (
            <div style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
              <p><strong>住所:</strong> {store.address}</p>
              <p>地図上の位置も確認できます</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}