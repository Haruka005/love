// イベント詳細画面
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

export default function EventDetail() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    //閲覧履歴用
    const saveToHistory = (eventData) => {
        const history = JSON.parse(localStorage.getItem("view_history") || "[]");

        const newItem = {
            id: eventData.id,
            name: eventData.name,
            image: eventData.image_path || eventData.topimage_path || eventData.image_url,
            type: "event", //飲食店と区別するため
            viewedAt: new Date().getTime()
        };

        const filteredHistory = history.filter(item => item.id !== newItem.id);
        const newHistory = [newItem, ...filteredHistory].slice(0, 10);
        localStorage.setItem("view_history", JSON.stringify(newHistory));
    };

    const fetchEvent = useCallback(async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/events/${id}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) {
                throw new Error(`エラーが発生しました: ${res.status}`);
            }

            const data = await res.json();
            setEvent(data);
            saveToHistory(data);
        } catch (err) {
            console.error("Fetch Error:", err);
            setEvent(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchEvent();
    }, [fetchEvent]);

    if (loading) return <p style={{ padding: "20px" }}>読み込み中...</p>;

    if (!event) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <p>ご指定のイベントは見つかりませんでした。</p>
                <button onClick={() => navigate("/#event-list")}>戻る</button>
            </div>
        );
    }

    // 画像URLの組み立て（置換ロジック適用）
    const rawPath = event.image_path || event.topimage_path || event.image_url;
    const fullImageUrl = rawPath 
        ? (rawPath.startsWith('http') 
            ? rawPath.replace(/^http:\/\/[^/]+/, SERVER_ROOT) 
            : `${SERVER_ROOT}${rawPath.startsWith('/') ? '' : '/'}${rawPath}`)
        : null;

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2>{event.name}</h2>

            {fullImageUrl && (
                <img
                    src={fullImageUrl}
                    alt={event.name}
                    style={{ width: "100%", maxWidth: "500px", borderRadius: "8px", marginBottom: "20px" }}
                    onError={(e) => {
                        e.target.src = "https://placehold.jp/24/cccccc/ffffff/200x150.png?text=No%20Image";
                    }}
                />
            )}

            <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>{event.catchphrase}</p>

            <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
                <h3>イベント情報</h3>
                <p><strong>開始日：</strong>{event.start_date}</p>
                <p><strong>終了日：</strong>{event.end_date}</p>
                <p><strong>場所：</strong>{event.location ?? "未設定"}</p>
                <p><strong>URL：</strong>{event.url ? <a href={event.url} target="_blank" rel="noopener noreferrer">{event.url}</a> : "未設定"}</p>
                <p><strong>主催者：</strong>{event.organizer ?? "未設定"}</p>
                <p><strong>予約：</strong>
                    {event.is_free_participation === 0
                        ? "要予約"
                        : event.is_free_participation === 1
                        ? "自由参加"
                        : "未設定"}
                </p>
            </div>

            <div style={{ marginTop: "20px" }}>
                <h3>詳細</h3>
                <p style={{ whiteSpace: "pre-wrap" }}>{event.description ?? "詳細はありません"}</p>
            </div>

            <div style={{ marginTop: "20px" }}>
                <h3>注意事項</h3>
                <p style={{ whiteSpace: "pre-wrap" }}>{event.notes ?? "注意事項はありません"}</p>
            </div>

            <div style={{ marginTop: "40px", textAlign: "center", display: "flex", gap: "10px", justifyContent: "center" }}>
                <button 
                    onClick={() => navigate("/#event-list")}
                    style={{ padding: "10px 20px", cursor: "pointer" }}
                >
                    戻る
                </button>
            </div>
        </div>
    );
}