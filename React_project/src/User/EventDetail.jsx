// イベント詳細画面
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

// APIのベースURLを調整（末尾の /api 重複を防止する共通ロジック）
const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    // 末尾が /api で終わっていればそのまま、そうでなければ /api を付与
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

const API_BASE = getBaseApiUrl();

export default function EventDetail() {
    const { id } = useParams(); // URLからid取得
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchEvent = useCallback(async () => {
        // IDが取得できない場合の404回避
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
                // 404エラーなどの場合に例外を投げる
                throw new Error(`エラーが発生しました: ${res.status}`);
            }

            const data = await res.json();
            setEvent(data);
        } catch (err) {
            console.error("Fetch Error:", err);
            setEvent(null); // データが取れなかったことを明示
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchEvent();
    }, [fetchEvent]);

    if (loading) return <p style={{ padding: "20px" }}>読み込み中...</p>;

    // 404またはデータ不在時の表示
    if (!event) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <p>ご指定のイベントは見つかりませんでした。</p>
                <button onClick={() => navigate(-1)}>戻る</button>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2>{event.name}</h2>

            {event.image_path && (
                <img
                    src={event.image_path}
                    alt={event.name}
                    style={{ width: "100%", maxWidth: "500px", borderRadius: "8px", marginBottom: "20px" }}
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
                    onClick={() => navigate(-1)}
                    style={{ padding: "10px 20px", cursor: "pointer" }}
                >
                    戻る
                </button>
            </div>
        </div>
    );
}