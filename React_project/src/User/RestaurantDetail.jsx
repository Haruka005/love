import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

// APIのベースURLを調整
const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

// 画像表示用のベースURL
const getServerRootUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    return envUrl.endsWith("/api") ? envUrl.replace(/\/api$/, "") : envUrl;
};

const API_BASE = getBaseApiUrl();
const SERVER_ROOT = getServerRootUrl();

export default function RestaurantDetail() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    //閲覧履歴用
    const saveToHistory = (data) => {
        const history = JSON.parse(localStorage.getItem("view_history") || "[]");

        const newItem = {
            id: data.id,
            name: data.name,
            image: data.all_images?.[0] || data.image_path || data.topimage_path,
            type: "restaurant", 
            viewedAt: new Date().getTime()
        };

        const filteredHistory = history.filter(item => 
            !(item.id === newItem.id && item.type === "restaurant")
        );

        const newHistory = [newItem, ...filteredHistory].slice(0, 10);

        localStorage.setItem("view_history", JSON.stringify(newHistory));
    };

    const fetchRestaurant = useCallback(async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/restaurants/${id}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) {
                throw new Error(`飲食店取得失敗: ${res.status}`);
            }

            const data = await res.json();
            setRestaurant(data);
            saveToHistory(data);
        } catch (err) {
            console.error("Fetch Error:", err);
            setRestaurant(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchRestaurant();
    }, [fetchRestaurant]);

    if (loading) return <p style={{ padding: "40px", textAlign: "center", fontFamily: '"Zen Maru Gothic", sans-serif' }}>読み込み中...</p>;

    if (!restaurant) {
        return (
            <div style={{ padding: "40px", textAlign: "center", fontFamily: '"Zen Maru Gothic", sans-serif' }}>
                <p>ご指定の飲食店は見つかりませんでした。</p>
                <button 
                    onClick={() => navigate("/#restaurant-list")}
                    style={{
                        marginTop: "20px",
                        padding: "10px 25px",
                        borderRadius: "25px",
                        border: "1px solid #f93d5d",
                        backgroundColor: "#fff",
                        color: "#f93d5d",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    トップへ戻る
                </button>
            </div>
        );
    }

    return (
        <div style={{ 
            padding: "40px 20px", 
            maxWidth: "900px", 
            margin: "0 auto", 
            fontFamily: '"Zen Maru Gothic", sans-serif',
            color: "#555"
        }}>
            <h2 style={{ 
                fontSize: "2rem", 
                fontWeight: "700", 
                color: "#f93d5d", 
                marginBottom: "5px",
                textAlign: "center"
            }}>
                {restaurant.name}
            </h2>
            
            <p style={{ 
                fontSize: "1.1rem", 
                color: "#888", 
                textAlign: "center", 
                marginBottom: "30px",
                fontWeight: "500"
            }}>
                {restaurant.catchphrase}
            </p>

            {/* 画像ギャラリー */}
            {restaurant.all_images && restaurant.all_images.length > 0 && (
                <div style={{ 
                    display: "flex", 
                    flexWrap: "wrap", 
                    justifyContent: "center", 
                    gap: "15px", 
                    marginBottom: "30px" 
                }}>
                    {restaurant.all_images.map((path, index) => {
                        if (!path) return null;

                        const imageUrl = path.startsWith('http') 
                            ? path.replace(/^http:\/\/[^/]+/, SERVER_ROOT) 
                            : `${SERVER_ROOT}${path.startsWith('/') ? '' : '/'}${path}`;
                        
                        return (
                            <img
                                key={index}
                                src={imageUrl}
                                alt={`${restaurant.name} 画像${index + 1}`}
                                style={{ 
                                    width: restaurant.all_images.length === 1 ? "100%" : "calc(50% - 8px)", 
                                    maxWidth: restaurant.all_images.length === 1 ? "600px" : "400px",
                                    height: "auto",
                                    aspectRatio: "4/3",
                                    objectFit: "cover",
                                    borderRadius: "20px", 
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                }}
                                onError={(e) => {
                                    e.target.src = "/images/no-image.png";
                                }}
                            />
                        );
                    })}
                </div>
            )}

            <div style={{ 
                backgroundColor: "#fff", 
                padding: "30px", 
                borderRadius: "20px", 
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                lineHeight: "1.8"
            }}>
                <h3 style={{ 
                    color: "#f93d5d", 
                    borderBottom: "2px dotted #f93d5d", 
                    display: "inline-block",
                    marginBottom: "20px",
                    paddingBottom: "5px"
                }}>
                    店舗情報
                </h3>
                
                <div style={{ display: "grid", gap: "10px" }}>
                    <p><strong>ジャンル：</strong>{restaurant.genre?.name ?? "ジャンル不明"}</p>
                    <p><strong>エリア：</strong>{restaurant.area?.name ?? "エリア不明"}</p>
                    <p><strong>予算：</strong>{restaurant.budget?.name ?? "予算不明"}</p>
                    <p><strong>住所：</strong>{restaurant.address ?? "住所不明"}</p>
                    <p><strong>営業時間：</strong>{restaurant.business_hours ?? "未設定"}</p>
                    <p><strong>定休日：</strong>{restaurant.holiday ?? "未設定"}</p>
                </div>

                <div style={{ marginTop: "30px" }}>
                    <h3 style={{ 
                        color: "#f93d5d", 
                        borderBottom: "2px dotted #f93d5d", 
                        display: "inline-block",
                        marginBottom: "15px",
                        paddingBottom: "5px"
                    }}>
                        お店からのコメント
                    </h3>
                    <p style={{ 
                        whiteSpace: "pre-wrap", 
                        backgroundColor: "#fefefe", 
                        padding: "15px", 
                        borderRadius: "12px",
                        border: "1px solid #eee" 
                    }}>
                        {restaurant.comment ?? "コメントはありません"}
                    </p>
                </div>
            </div>

            <div style={{ marginTop: "40px", textAlign: "center" }}>
                <button 
                    onClick={() => navigate("/#restaurant-list")}
                    style={{ 
                        padding: "12px 40px", 
                        cursor: "pointer",
                        borderRadius: "30px",
                        border: "1px solid #f93d5d",
                        backgroundColor: "#fff",
                        color: "#f93d5d",
                        fontSize: "1rem",
                        fontWeight: "700",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 10px rgba(249, 61, 93, 0.1)"
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#f93d5d";
                        e.currentTarget.style.color = "#fff";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#fff";
                        e.currentTarget.style.color = "#f93d5d";
                    }}
                >
                    一覧へ戻る
                </button>
            </div>
        </div>
    );
}