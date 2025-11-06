//地図使用するときに使用するファイル
//Nominatim→住所 ⇔ 緯度・経度」の変換を行う無料のサービス

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
//地図用アイコン
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ピンアイコン
const pinIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// 地図移動用コンポーネント
function FlyToLocation({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 16);
    }
  }, [lat, lng, map]);
  return null;
}

// メイン地図表示
export default function MapView({ address }) {
  const defaultPosition = [42.4125, 140.9969];
  const [position, setPosition] = useState(defaultPosition);

  useEffect(() => {
    if (!address) return;

   const fetchCoordinates = async () => {
  try {
    const res = await fetch(`http://localhost:8000/api/geocode?q=${encodeURIComponent(address)}`);
    const text = await res.text();

    try {
      const data = JSON.parse(text);
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setPosition([lat, lon]);
      }
    } catch (err) {
      console.error("座標取得失敗: JSONパースエラー", text);
    }
  } catch (err) {
    console.error("座標取得失敗: 通信エラー", err);
  }
};

    fetchCoordinates();
  }, [address]);

  return (
    <MapContainer center={position} zoom={14} style={{ height: "300px", marginBottom: "20px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FlyToLocation lat={position[0]} lng={position[1]} />
      <Marker position={position} icon={pinIcon}>
        <Popup>{address || "店舗の位置"}</Popup>
      </Marker>
    </MapContainer>
  );
}