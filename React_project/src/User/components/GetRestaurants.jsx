import React, { useEffect, useState, useCallback } from "react";
import RestaurantCard from "./RestaurantCard";
import Pagenation from "./Pagenation";

const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

const API_BASE = getBaseApiUrl();

function GetRestaurants() {
    const [restaurants, setRestaurants] = useState([]); 
    const [loading, setLoading] = useState(true);      
    const [error, setError] = useState(null);          
    const [selectedGenre, setSelectedGenre] = useState("すべて"); 

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const fetchRestaurants = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE}/restaurants`);
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`HTTP error! status: ${response.status}. Detail: ${text.substring(0, 100)}...`);
            }
            const data = await response.json();
            setRestaurants(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("取得エラー:", err);
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
        : restaurants.filter((shop) => shop.genre?.name === selectedGenre);

    const indexOfLastRestaurant = currentPage * itemsPerPage;
    const indexOfFirstRestaurant = indexOfLastRestaurant - itemsPerPage;
    const currentRestaurants = filtered.slice(indexOfFirstRestaurant, indexOfLastRestaurant);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const handleGenreChange = (genre) => {
        setSelectedGenre(genre);
        setCurrentPage(1);
    };

    return (
        <section 
            style={{ 
                marginTop: "0px",  
                padding: "40px 0 50px", 
                marginBottom: "0px",
                textAlign: "center", 
                backgroundImage: `url("/images/aoonibackgr.png")`, 
                backgroundSize: "auto",      
                backgroundRepeat: "repeat",  
                backgroundPosition: "center",
                color: "#120101ff",
                fontFamily: '"Zen Maru Gothic", sans-serif'
            }}
        >
            {/* タイトルセクション：画像左、文字右 */}
            <div style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
                marginBottom: "30px",
                paddingBottom: "10px",
                paddingLeft: "30px",
                paddingRight: "20px",
                borderBottom: "3px dotted #f7f0f0ff",
                maxWidth: "95%"
            }}>
                <img 
                    src="/images/aoonitousin.png" 
                    alt="icon-blue" 
                    style={{ 
                        width: "80px", 
                        height: "auto"
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
                        border: "none",      
                        padding: 0,
                        /* 修正ポイント：白縁取りを強調し、青の広がりを抑えた発光 */
                        textShadow: `
                            -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff,
                            0 0 8px #fff,
                            0 0 15px #0036e9,
                            0 0 25px rgba(0, 54, 233, 0.7)
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

            <div className="button-group" style={{ marginBottom: "30px" }}>
                {["すべて", "和食", "洋食", "中華・アジア", "スイーツ・デザート", "ファストフード・軽食", "その他"].map((genre) => (
                    <button
                        key={genre}
                        className={`tab-button ${selectedGenre === genre ? "active" : ""}`}
                        onClick={() => handleGenreChange(genre)}
                        style={{
                            backgroundColor: selectedGenre === genre ? "#0036e9ff" : "#fff",
                            color: selectedGenre === genre ? "#fff" : "#555",
                            fontWeight: selectedGenre === genre ? "bold" : "normal",
                            margin: "5px",
                            padding: "8px 15px",
                            borderRadius: "20px",
                            border: "1px solid #ddd",
                            cursor: "pointer"
                        }}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            <div style={{ padding: "0 10px" }}>
                <h4 style={{ 
                    fontSize: "1.4rem", 
                    marginBottom: "20px", 
                    color: "#fff", 
                    fontWeight: "700"
                }}>
                    {selectedGenre} のお店
                </h4>

                {loading && <p>読み込み中です…</p>}
                {error && <p style={{ color: "yellow" }}>{error}</p>}

                {!loading && !error && filtered.length === 0 ? (
                    <p style={{ 
                        padding: "20px", 
                        backgroundColor: "rgba(255,255,255,0.8)", 
                        borderRadius: "8px",
                        display: "inline-block" 
                    }}>
                        現在、該当する店舗情報はありません
                    </p>
                ) : (
                    <div className="card-list">
                        {currentRestaurants.map((shop) => (
                            <RestaurantCard
                                key={shop.id}
                                id={shop.id}
                                name={shop.name ?? "名称未設定"}
                                area={shop.area?.name ?? "エリア不明"}
                                genre={shop.genre?.name ?? "ジャンル不明"}
                                budget={shop.budget?.name ?? "予算不明"}
                                address={shop.address ?? "住所不明"}
                                image={shop.image_url ?? ""}
                            />
                        ))}
                    </div>
                )}
            </div>

            {!loading && totalPages > 1 && (
                <Pagenation
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            )}
        </section>
    );
}

export default GetRestaurants;