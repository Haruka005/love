import React, { useEffect, useState, useCallback, useRef } from "react";
import RestaurantCard from "./RestaurantCard";
import Pagenation from "./Pagenation";
import { useNavigate, useLocation } from "react-router-dom"; 

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

//飲食店情報の取得反映
// 登別駅の緯度経度
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

const createOniPhotoIcon = (imageUrl) => {
    return L.divIcon({
        html: `
            <div style="position: relative; width: 50px; height: 50px;">
                <img src="/images/onioni.png" style="width: 50px; height: 50px; display: block;" />
                <div style="
                    position: absolute; 
                    top: 15px; 
                    left: 50%; 
                    transform: translateX(-50%); 
                    width: 36px; 
                    height: 36px; 
                    border-radius: 50%; 
                    overflow: hidden; 
                    border: 2px solid white;
                    background: white;
                ">
                    <img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
            </div>
        `,
        className: "custom-oni-icon",
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -50],
    });
};

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

// 修正：引数に onRecordClick を追加
function GetRestaurants({ onRecordClick }) {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [restaurants, setRestaurants] = useState([]); 
    const [loading, setLoading] = useState(true);      
    const [selectedGenre, setSelectedGenre] = useState("すべて"); 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    
    useEffect(() => {
        if (location.hash === "#restaurant-list" || window.location.hash === "#restaurant-list") {
            const timer = setTimeout(() => {
                const element = document.getElementById("restaurant-list");
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 300); 
            return () => clearTimeout(timer);
        }
    }, [location]); 

    const fetchRestaurants = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/restaurants`);
            const data = await response.json();
            setRestaurants(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchRestaurants(); }, [fetchRestaurants]);

    const filtered = selectedGenre === "すべて"
        ? restaurants
        : restaurants.filter((shop) => {
            const dbGenreName = shop.genre?.name || "";
            return dbGenreName.includes(selectedGenre) || selectedGenre.includes(dbGenreName);
        });

    const currentRestaurants = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const getFullImageUrl = (shop) => {
        const rawPath = shop.topimage_path || shop.image_url || shop.image_path;
        if (!rawPath) return "/images/no-image.png";
        return rawPath.startsWith('http') 
            ? rawPath.replace(/^http:\/\/[^/]+/, SERVER_ROOT) 
            : `${SERVER_ROOT}${rawPath.startsWith('/') ? '' : '/'}${rawPath}`;
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        const element = document.getElementById("restaurant-list");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
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
                justifyContent: "center",
                gap: "15px",
                marginBottom: "30px",
                paddingBottom: "10px",
                paddingLeft: "30px",
                paddingRight: "20px",
                borderBottom: "3px dotted #f7f0f0ff",
                maxWidth: "95%"
            }}>
                <img 
                    src="/images/aoonitousin.png" 
                    alt="icon" 
                    style={{ 
                        width: "80px", 
                        height: "auto",
                        marginRight: "5px"
                    }} 
                />

                <div style={{ textAlign: "left" }}>
                    <h2 style={{ 
                        margin: 0, 
                        fontSize: "2.2rem", 
                        fontWeight: "900", 
                        color: "#0233d2ec", 
                        letterSpacing: "1px",
                        lineHeight: "1.1",
                        textShadow: `
                            -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff,
                            0 0 8px #fff,
                            0 0 15px #0233d2,
                            0 0 25px rgba(2, 51, 210, 0.7)
                        `
                    }}>
                        RESTAURANTS
                    </h2>
                    <span style={{ 
                        fontSize: "0.9rem", 
                        fontWeight: "700", 
                        color: "#f7f0f0ff",
                        marginLeft: "5px", 
                        display: "block",
                        marginTop: "2px"
                    }}>
                        飲食店一覧
                    </span>
                </div>
            </div>

            <div style={{ 
                position: "relative", 
                width: "98%", 
                maxWidth: "1100px", 
                height: "auto",
                aspectRatio: "16 / 9", 
                minHeight: "350px", 
                maxHeight: "550px", 
                margin: "0 auto 40px", 
                borderRadius: "25px", 
                overflow: "hidden", 
                boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                border: "6px solid white"
            }}>
                <div style={{
                    position: "absolute",
                    top: "15px",
                    left: "15px",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "flex-start",
                    width: "calc(100% - 30px)"
                }}>
                    <div style={{
                        backgroundColor: "white",
                        padding: "6px 12px",
                        borderRadius: "30px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: "#333"
                    }}>
                        📍 登別市 <span>|</span> <span style={{color: "#0036e9"}}>{filtered.length}件表示中</span>
                    </div>

                    <div style={{ 
                        display: "flex", 
                        gap: "8px", 
                        overflowX: "auto", 
                        width: "100%",
                        paddingBottom: "10px",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none"
                    }} className="hide-scrollbar">
                        {["すべて", "和食", "洋食", "中華・アジア", "スイーツ・デザート", "ファストフード・軽食", "その他"].map((genre) => (
                            <button
                                key={genre}
                                onClick={() => {setSelectedGenre(genre); setCurrentPage(1);}}
                                style={{
                                    backgroundColor: selectedGenre === genre ? "#0036e9" : "rgba(255,255,255,0.95)",
                                    color: selectedGenre === genre ? "white" : "#555",
                                    border: "none",
                                    padding: "6px 14px",
                                    borderRadius: "20px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                    fontSize: "0.85rem",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                                }}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>

                <MapContainer center={HOROBETSU_STATION} zoom={15} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                    {filtered.map((shop) => {
                        const fullImageUrl = getFullImageUrl(shop);
                        return (
                            shop.latitude && shop.longitude && (
                                <Marker 
                                    key={shop.id} 
                                    position={[Number(shop.latitude), Number(shop.longitude)]}
                                    icon={createOniPhotoIcon(fullImageUrl)}
                                >
                                    <Popup>
                                        <div style={{ textAlign: "center", width: "160px" }}>
                                            <img src={fullImageUrl} alt={shop.name} style={{ width: "100%", height: "90px", objectFit: "cover", borderRadius: "8px" }} />
                                            <p style={{ margin: "8px 0", fontWeight: "bold" }}>{shop.name}</p>
                                            {/* 修正：詳細クリック時に計測 */}
                                            <button 
                                                onClick={() => {
                                                    onRecordClick && onRecordClick(shop.id);
                                                    navigate(`/restaurants/${shop.id}`);
                                                }} 
                                                style={{ background: "#0036e9", color: "#fff", border: "none", padding: "5px 15px", borderRadius: "15px", cursor: "pointer" }}
                                            >
                                                詳細
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

            <div style={{ padding: "0 10px", marginBottom: "30px" }}>
                <h4 style={{ 
                    fontSize: "1.4rem", 
                    marginBottom: "20px", 
                    color: "#fff", 
                    fontWeight: "700",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.3)"
                }}>
                    {selectedGenre} のお店一覧
                </h4>
            </div>

            <div style={{ padding: "0 20px" }}>
                <div className="card-list" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "25px" }}>
                    {currentRestaurants.map((shop) => (
                        // 修正：カードクリック時に計測
                        <div key={shop.id} onClick={() => onRecordClick && onRecordClick(shop.id)} style={{ cursor: "pointer" }}>
                            <RestaurantCard 
                                {...shop} 
                                area={shop.area?.name} 
                                genre={shop.genre?.name} 
                                budget={shop.budget?.name} 
                                image={getFullImageUrl(shop)} 
                            />
                        </div>
                    ))}
                </div>
            </div>

            {totalPages > 1 && (
                <Pagenation 
                    totalPages={totalPages} 
                    currentPage={currentPage} 
                    onPageChange={handlePageChange} 
                />
            )}
        </section>
    );
}

export default GetRestaurants;