// EventApproval.jsx（管理者未承認イベント画面）

import React, { useState, useEffect } from "react";

/**
 * APIのベースURLを構築する関数
 * 環境変数の末尾が /api かどうかを判定し、二重スラッシュや二重apiパスを防ぎます
 */
const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    // 環境変数が /api で終わっていればそのまま、そうでなければ /api を足す
    const base = envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
    return `${base}/admin/events`;
};

const API_URL = getBaseApiUrl();

export default function EventApproval({ onUpdate }) {
    const [pendingEvents, setPendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    // 承認待ちイベントのデータを取得
    const fetchPendingEvents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("admintoken");
            // API_URL は既に /api/admin/events なので、後ろに /pending を付与
            const response = await fetch(`${API_URL}/pending`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setPendingEvents(data);
            } else {
                console.error("承認待ちイベントの取得に失敗しました。ステータス:", response.status);
                setPendingEvents([]); 
            }
        } catch (error) {
            console.error("通信エラー:", error);
            setPendingEvents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingEvents();
    }, []);

    // 承認/却下処理
    const handleStatusUpdate = async (eventId, newStatus) => {
        let confirmationMessage = `イベントID ${eventId} を「${newStatus === 'approved' ? '承認' : '却下'}」しますか？`;
        let requestBody = { status: newStatus };
        
        if (newStatus === 'rejected') {
            const reason = window.prompt("却下する理由を入力してください（任意）:");
            if (reason === null) return; // キャンセルされた場合
            
            requestBody.reason = reason; 
            if (reason.trim() !== '') {
                confirmationMessage = `イベントID ${eventId} を理由「${reason.substring(0, 20)}...」で却下しますか？`;
            }
        }

        if (!window.confirm(confirmationMessage)) return;

        try {
            const token = localStorage.getItem("admintoken");
            const response = await fetch(`${API_URL}/${eventId}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                alert(`${newStatus === 'approved' ? '承認' : '却下'}が完了しました。`);
                // 画面上のリストから削除
                setPendingEvents(prev => prev.filter(event => event.id !== eventId));
                // 親コンポーネント（AdminTopなど）のカウントを更新するために通知
                if (onUpdate) onUpdate(); 
            } else {
                const errorData = await response.json();
                alert(`処理に失敗しました: ${errorData.message || 'エラーが発生しました'}`);
            }
        } catch (error) {
            alert(`ネットワークエラーが発生しました: ${error.message}`);
        }
    };

    if (loading) return <p style={{ padding: "20px" }}>イベント申請データを読み込み中...</p>;

    return (
        <div style={{ padding: "10px" }}>
            <h3 style={{ marginBottom: "20px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
                承認待ちイベント ({pendingEvents.length} 件)
            </h3>
            
            {pendingEvents.length === 0 ? (
                <p style={{ color: "green", fontWeight: "bold", textAlign: "center", marginTop: "30px" }}>
                    現在、承認待ちのイベント申請はありません。
                </p>
            ) : (
                pendingEvents.map((event) => {
                    // 再申請かどうかを判定 (status: 3 等、DBの設計に合わせて調整してください)
                    const isResubmitted = Number(event.approval_status_id) === 3;

                    return (
                        <div
                            key={event.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "20px",
                                marginBottom: "20px",
                                backgroundColor: isResubmitted ? "#fffaf0" : "#fff",
                                boxShadow: isResubmitted ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "0 2px 4px rgba(0,0,0,0.05)",
                                transition: "all 0.3s ease"
                            }}
                        >
                            {/* タイトル行（クリックで詳細開閉） */}
                            <div
                                onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                                style={{ 
                                    cursor: "pointer", 
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}
                            >
                                <div style={{ display: "block" }}>
                                    <strong style={{ fontSize: "18px", color: "#333", display: "block", marginBottom: "5px" }}>
                                        {event.name || `イベント #${event.id}`} 
                                    </strong>
                                    {isResubmitted ? (
                                        <span style={{ backgroundColor: "#faad14", color: "white", fontSize: "12px", padding: "3px 12px", borderRadius: "12px", fontWeight: "bold", display: "inline-block" }}>再申請</span>
                                    ) : (
                                        <span style={{ backgroundColor: "#1890ff", color: "white", fontSize: "12px", padding: "3px 12px", borderRadius: "12px", fontWeight: "bold", display: "inline-block" }}>新規申請</span>
                                    )}
                                </div>
                                <span style={{ color: "#666", fontSize: "13px", fontWeight: "bold" }}>
                                    {expandedId === event.id ? '▲ 閉じる' : '▼ 詳細表示'}
                                </span>
                            </div>

                            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                                申請者ID: {event.user_id} | 申請日時: {event.created_at ? new Date(event.created_at).toLocaleString() : "不明"}
                            </p>

                            {/* 詳細情報エリア */}
                            {expandedId === event.id && (
                                <div style={{ marginTop: "15px", padding: "15px", borderTop: "1px solid #eee", backgroundColor: "rgba(255,255,255,0.5)" }}>
                                    {isResubmitted && event.rejection_reason && (
                                        <div style={{ backgroundColor: "#fff0f0", padding: "12px", borderRadius: "5px", marginBottom: "15px", border: "1px solid #ffccc7" }}>
                                            <strong style={{ color: "#cf1322", fontSize: "14px" }}>⚠️ 前回の却下理由：</strong>
                                            <p style={{ margin: "5px 0 0", color: "#cf1322", fontSize: "14px" }}>{event.rejection_reason}</p>
                                        </div>
                                    )}

                                    <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "8px", fontSize: "14px" }}>
                                        <strong>見出し:</strong> <span>{event.catchphrase || "未入力"}</span>
                                        <strong>開催期間:</strong> <span>{event.start_date} ～ {event.end_date}</span>
                                        <strong>場所:</strong> <span>{event.location}</span>
                                        <strong>予約区分:</strong> <span>{Number(event.is_free_participation) === 1 ? "自由参加" : "要予約"}</span>
                                        <strong>主催者:</strong> <span>{event.organizer}</span>
                                        <strong>URL:</strong> <a href={event.url} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", wordBreak: "break-all" }}>{event.url}</a>
                                    </div>

                                    <div style={{ marginTop: "12px" }}>
                                        <strong>詳細説明:</strong>
                                        <p style={{ whiteSpace: "pre-wrap", marginTop: "5px", fontSize: "13px", color: "#444" }}>{event.description || '記載なし'}</p>
                                    </div>

                                    {event.image_path && (
                                        <div style={{ marginTop: '15px' }}>
                                            <strong>画像:</strong>
                                            <img 
                                                src={event.image_path} 
                                                alt="イベント画像" 
                                                style={{ maxWidth: '100%', maxHeight: '300px', display: 'block', marginTop: '8px', borderRadius: '6px', border: "1px solid #eee" }}
                                            />
                                        </div>
                                    )}

                                    {/* 操作ボタン */}
                                    <div style={{ marginTop: "25px", display: "flex", justifyContent: "flex-end", gap: "15px" }}>
                                        <button
                                            onClick={() => handleStatusUpdate(event.id, 'rejected')}
                                            style={{ padding: "10px 25px", backgroundColor: "#fff", color: "#f44336", border: "1px solid #f44336", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                                        >
                                            却下する
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(event.id, 'approved')}
                                            style={{ padding: "10px 25px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                                        >
                                            承認して公開
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}