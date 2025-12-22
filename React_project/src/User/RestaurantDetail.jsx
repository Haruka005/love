// 飲食店詳細画面
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

// APIのベースURLを調整（末尾の /api 重複を防止する共通ロジック）
const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

// 画像表示用のベースURL（/api を含まないサーバーのルートURL）
const getServerRootUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    return envUrl.endsWith("/api") ? envUrl.replace(/\/api$/, "") : envUrl;
};

const API_BASE = getBaseApiUrl();
const SERVER_ROOT = getServerRootUrl();

export default function RestaurantDetail() {
    const { id } = useParams(); // URLからid取得
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <p style={{ padding: "20px" }}>読み込み中...</p>;

    // 404またはデータ不在時の表示
    if (!restaurant) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <p>ご指定の飲食店は見つかりませんでした。</p>
                <button onClick={() => navigate(-1)}>戻る</button>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2>{restaurant.name}</h2>

            {/* 画像一覧 */}
            {restaurant.images && restaurant.images.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                    {restaurant.images.map((img, index) => {
                        // 画像パスがフルURL(http〜)でない場合、サーバーのルートURLを付与
                        const imageUrl = img.startsWith('http') 
                            ? img 
                            : `${SERVER_ROOT}${img.startsWith('/') ? '' : '/'}${img}`;
                        
                        return (
                            <img
                                key={index}
                                src={imageUrl}
                                alt={`${restaurant.name} 画像${index + 1}`}
                                style={{ 
                                    width: "100%", 
                                    maxWidth: "500px", 
                                    borderRadius: "8px", 
                                    marginBottom: "10px",
                                    display: "block"
                                }}
                                // 万が一画像が404エラーになった場合の代替処理
                                onError={(e) => {
                                    e.target.src = "https://placehold.jp/24/cccccc/ffffff/200x150.png?text=No%20Image";
                                }}
                            />
                        );
                    })}
                </div>
            )}

            <p style={{ fontSize: "18px", marginTop: "10px", fontWeight: "bold" }}>
                {restaurant.catchphrase}
            </p>

            <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
                <h3>店舗情報</h3>
                <p><strong>ジャンル：</strong>{restaurant.genre?.name ?? "ジャンル不明"}</p>
                <p><strong>エリア：</strong>{restaurant.area?.name ?? "エリア不明"}</p>
                <p><strong>予算：</strong>{restaurant.budget?.name ?? "予算不明"}</p>
                <p><strong>住所：</strong>{restaurant.address ?? "住所不明"}</p>
                <p><strong>営業時間：</strong>{restaurant.business_hours ?? "未設定"}</p>
                <p><strong>定休日：</strong>{restaurant.holiday ?? "未設定"}</p>
            </div>

            <div style={{ marginTop: "20px" }}>
                <h3>コメント</h3>
                <p style={{ whiteSpace: "pre-wrap" }}>{restaurant.comment ?? "コメントはありません"}</p>
            </div>

            <div style={{ marginTop: "30px", textAlign: "center" }}>
                <button 
                    onClick={() => navigate(-1)}
                    style={{ padding: "10px 20px", cursor: "pointer" }}
                >
                    戻る
                </button>
            </div>
        </div>
    );
}