import React, { useEffect, useState, useCallback } from "react";
import EventCard from "./EventCard";
// 正しいスペル (dateFormatter) に修正済み
import { DateTime } from "./dateFormatter.js";

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

/**
 * 直近のイベントを表示するコンポーネント
 */
function UpComingEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // データの取得ロジック
    const fetchUpcomingEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // API_BASEを使用してリクエスト。Laravel側のルートが /api/events/upcoming を想定
            const response = await fetch(`${API_BASE}/events/upcoming`, {
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // データが配列であることを確認して保存
            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("イベント取得エラー:", error);
            setError("注目のイベントを取得できませんでした。");
        } finally {
            setLoading(false);
        }
    }, []);

    // コンポーネントがマウントされた時に一度だけデータを取得
    useEffect(() => {
        fetchUpcomingEvents();
    }, [fetchUpcomingEvents]);

    // 読み込み中表示
    if (loading) {
        return <p style={{ textAlign: "center", padding: "40px" }}>イベントを読み込み中...</p>;
    }

    // エラー発生時の表示
    if (error) {
        return (
            <div style={{ textAlign: "center", padding: "40px" }}>
                <p style={{ color: "red" }}>{error}</p>
                <button onClick={fetchUpcomingEvents} style={{ cursor: "pointer" }}>再試行</button>
            </div>
        );
    }

    return (
        <section className="container" style={{ padding: "40px 0" }}>
            <h2 style={{ textAlign: "center", marginBottom: "30px" }}>直近のイベント</h2>
            
            {events.length === 0 ? (
                <p style={{ textAlign: "center" }}>現在予定されているイベントはありません。</p>
            ) : (
                <div className="card-list" style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
                    gap: "20px",
                    padding: "0 20px"
                }}>
                    {events.map((event) => {
                        // 画像パスの正規化（相対パスの場合はSERVER_ROOTを付与）
                        const rawPath = event.topimage_path || event.image_url || "";
                        const fullImageUrl = rawPath.startsWith('http') 
                            ? rawPath 
                            : `${SERVER_ROOT}${rawPath.startsWith('/') ? '' : '/'}${rawPath}`;

                        return (
                            <EventCard
                                key={event.id}
                                id={event.id}
                                name={event.name}
                                catchphrase={event.catchphrase}
                                // 加工したフルURLを渡す
                                image={fullImageUrl}
                                // dateFormatter.jsx の DateTime 関数を使用
                                start_date={DateTime(event.start_date)}
                                end_date={DateTime(event.end_date)}
                                location={event.location}
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default UpComingEvents;