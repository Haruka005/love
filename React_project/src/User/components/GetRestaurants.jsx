import React, { useEffect, useState, useCallback } from "react";
import RestaurantCard from "./RestaurantCard";
import Pagenation from "./Pagenation";
import { useNavigate } from "react-router-dom";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const HOROBETSU_STATION = [42.409441, 141.1069605];

const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

const getServerRootUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    return envUrl.endsWith("/api") ? envUrl.replace(/\/api$/, "") : envUrl;
};

const API_BASE = getBaseApiUrl();
const SERVER_ROOT = getServerRootUrl();

function RecenterAutomatically({ data }) {
    const map = useMap();
    useEffect(() => {
        //ジャンル切り替えた時の初期位置を幌別駅にする
       // map.setView(HOROBETSU_STATION,15);

        //これはフィルタリングしたお店に合わせて動かしたいというやつ
        const validCoords = data.filter(d => d.latitude && d.longitude);
        if (validCoords.length > 0) {
            const bounds = L.latLngBounds(validCoords.map(d => [Number(d.latitude), Number(d.longitude)]));
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        } else {
            map.setView(HOROBETSU_STATION, 15);
        }
        

    //ジャンルが変わるたびに変わるよ　    
    }, [data, map]);
    return null;
}

function GetRestaurants() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]); 
    const [loading, setLoading] = useState(true);      
    const [error, setError] = useState(null);          
    const [selectedGenre, setSelectedGenre] = useState("すべて"); 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchRestaurants = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE}/restaurants`);
            if (!response.ok) throw new Error("取得エラー");
            const data = await response.json();
            setRestaurants(Array.isArray(data) ? data : []);
        } catch (err) {
            setError("店舗情報の取得に失敗しました。");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRestaurants();
    }, [fetchRestaurants]);

    const filtered = selectedGenre === "すべて"
        ? restaurants
        : restaurants.filter((shop) =>{
            const dbGenreName = shop.genre?.name || "";
            //例）DBの和食系の中に、ボタンにある和食という言葉が含まれているか確認(===は完全一致 includeは含まれているかの確認)
            return dbGenreName.includes(selectedGenre)||selectedGenre.includes(dbGenreName);
        });

    const currentRestaurants = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const handleGenreChange = (genre) => {
        setSelectedGenre(genre);
        setCurrentPage(1);
    };

    return (
        <section style={{ 
            padding: "40px 0 50px", 
            textAlign: "center", 
            backgroundImage: `url("/images/aoonibackgr.png")`, 
            backgroundRepeat: "repeat",
            fontFamily: '"Zen Maru Gothic", sans-serif'
        }}>
            <div style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "20px", 
                marginBottom: "30px",
                paddingBottom: "10px",
                borderBottom: "3px dotted #f7f0f0ff"
            }}>
                <img src="/images/aoonitousin.png" alt="icon" style={{ width: "80px" }} />
                <div style={{ textAlign: "left" }}>
                    <h2 style={{ 
                        margin: 0, 
                        fontSize: "2.2rem", 
                        fontWeight: "900", 
                        color: "#0233d2ec", 
                        textShadow: "1px 1px 0 #fff, 0 0 15px #0036e9",
                        lineHeight: "1.2"
                    }}>
                        RESTAURANTS
                    </h2>
                    <span style={{ 
                        fontSize: "0.9rem", 
                        color: "#f7f0f0ff",
                        display: "block"
                    }}>
                        飲食店一覧
                    </span>
                </div>
            </div>

            <div className="button-group" style={{ marginBottom: "20px" }}>
                {["すべて", "和食", "洋食", "中華・アジア", "スイーツ・デザート", "ファストフード・軽食", "その他"].map((genre) => (
                    <button
                        key={genre}
                        onClick={() => handleGenreChange(genre)}
                        style={{
                            backgroundColor: selectedGenre === genre ? "#0036e9ff" : "#fff",
                            color: selectedGenre === genre ? "#fff" : "#555",
                            margin: "5px", padding: "8px 15px", borderRadius: "20px", border: "none", cursor: "pointer"
                        }}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            <div style={{ width: "90%", maxWidth: "800px", height: "400px", margin: "0 auto 30px", borderRadius: "15px", overflow: "hidden", border: "5px solid white", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }}>
                <MapContainer center={HOROBETSU_STATION} zoom={15} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                    {filtered.map((shop) => (
                        shop.latitude && shop.longitude && (
                            <Marker key={shop.id} position={[Number(shop.latitude), Number(shop.longitude)]}>
                                <Popup>
                                    <div style={{ textAlign: "center" }}>
                                        <strong>{shop.name}</strong><br />
                                        <button onClick={() => navigate(`/restaurants/${shop.id}`)} style={{ background: "#0036e9", color: "#fff", border: "none", padding: "5px 10px", marginTop: "5px", borderRadius: "5px", cursor: "pointer" }}>詳細を見る</button>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    ))}
                    <RecenterAutomatically data={filtered} />
                </MapContainer>
            </div>

            <div style={{ padding: "0 10px" }}>
                <h4 style={{ color: "#fff", marginBottom: "20px" }}>{selectedGenre} のお店</h4>
                <div className="card-list" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
                    {currentRestaurants.map((shop) => {
                        // --- プロパティ名を Laravel の topimage_path に合わせ、詳細画面と同じ置換を適用 ---
                        const rawPath = shop.topimage_path || shop.image_url || shop.image_path;
                        let fullImageUrl = "/images/no-image.png";

                        if (rawPath) {
                            // 1. http://localhost... を SERVER_ROOT (IP等) に置換
                            // 2. 相対パスの場合は SERVER_ROOT を付与
                            fullImageUrl = rawPath.startsWith('http') 
                                ? rawPath.replace(/^http:\/\/[^/]+/, SERVER_ROOT) 
                                : `${SERVER_ROOT}${rawPath.startsWith('/') ? '' : '/'}${rawPath}`;
                        }

                        return (
                            <RestaurantCard 
                                key={shop.id} 
                                {...shop} 
                                area={shop.area?.name} 
                                genre={shop.genre?.name} 
                                budget={shop.budget?.name} 
                                image={fullImageUrl} 
                            />
                        );
                    })}
                </div>
            </div>

            {totalPages > 1 && <Pagenation totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />}
        </section>
    );
}

export default GetRestaurants;