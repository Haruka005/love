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
        const validCoords = data.filter(d => d.latitude && d.longitude);
        if (validCoords.length > 0) {
            const bounds = L.latLngBounds(validCoords.map(d => [Number(d.latitude), Number(d.longitude)]));
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        } else {
            map.setView(HOROBETSU_STATION, 15);
        }
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
    const itemsPerPage = 4;

    // --- 詳細画面から戻った時に特定の場所にスクロールする処理 ---
    useEffect(() => {
        if (window.location.hash === "#restaurant-list") {
            const timer = setTimeout(() => {
                const element = document.getElementById("restaurant-list");
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 100); // 描画待ち
            return () => clearTimeout(timer);
        }
    }, []);

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
            return dbGenreName.includes(selectedGenre) || selectedGenre.includes(dbGenreName);
        });

    const currentRestaurants = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const handleGenreChange = (genre) => {
        setSelectedGenre(genre);
        setCurrentPage(1);
    };

    return (
        <section id="restaurant-list" style={{ 
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
                    {filtered.map((shop) => {
                        const rawPath = shop.topimage_path || shop.image_url || shop.image_path;
                        let fullImageUrl = "/images/no-image.png";
                        if (rawPath) {
                            fullImageUrl = rawPath.startsWith('http') 
                                ? rawPath.replace(/^http:\/\/[^/]+/, SERVER_ROOT) 
                                : `${SERVER_ROOT}${rawPath.startsWith('/') ? '' : '/'}${rawPath}`;
                        }

                        return (
                            shop.latitude && shop.longitude && (
                                <Marker key={shop.id} position={[Number(shop.latitude), Number(shop.longitude)]}>
                                    <Popup>
                                        <div style={{ textAlign: "center", width: "160px" }}>
                                            <img 
                                                src={fullImageUrl} 
                                                alt={shop.name} 
                                                style={{ 
                                                    width: "100%", 
                                                    height: "90px", 
                                                    objectFit: "cover", 
                                                    borderRadius: "8px",
                                                    marginBottom: "8px" 
                                                }} 
                                            />
                                            <strong style={{ fontSize: "1rem", display: "block", marginBottom: "5px", color: "#333" }}>
                                                {shop.name}
                                            </strong>
                                            <button 
                                                onClick={() => navigate(`/restaurants/${shop.id}`)} 
                                                style={{ 
                                                    background: "#0036e9", 
                                                    color: "#fff", 
                                                    border: "none", 
                                                    padding: "5px 12px", 
                                                    borderRadius: "20px", 
                                                    cursor: "pointer",
                                                    fontSize: "0.8rem"
                                                }}
                                            >
                                                詳細を見る
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        );
                    })}
                    <RecenterAutomatically data={filtered} />
                </MapContainer>
            </div>

            <div style={{ padding: "0 10px" }}>
                <h4 style={{ color: "#fff", marginBottom: "20px" }}>{selectedGenre} のお店</h4>
                <div className="card-list" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
                    {currentRestaurants.map((shop) => {
                        const rawPath = shop.topimage_path || shop.image_url || shop.image_path;
                        let fullImageUrl = "/images/no-image.png";

                        if (rawPath) {
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