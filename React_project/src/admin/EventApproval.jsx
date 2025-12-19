// EventApproval.js

import React, { useState, useEffect } from "react";

// ステータス更新APIのエンドポイント
//環境変数に合わせて修正した
const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/events`;  


// onUpdateはAdminTopから渡される、件数再取得用の関数
export default function EventApproval({ onUpdate }) {
    const [pendingEvents, setPendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    // 承認待ちイベントのデータを取得
    const fetchPendingEvents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token"); // ← 保存済みトークンを取得
             const response = await fetch(`${API_URL}/pending`, {
                headers: {
                    "Authorization": `Bearer ${token}`, // ← Bearerトークンを送信
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setPendingEvents(data);
            } else {
                console.error("承認待ちイベントの取得に失敗しました。ステータス:", response.status);
                console.error("レスポンス詳細:", await response.text());
                setPendingEvents([]); 
            }
        } catch (error) {
            console.error("通信エラー:", error);
            setPendingEvents([]);
        } finally {
            setLoading(false);
        }
    };

    // 初期ロード時にイベントリストを取得
    useEffect(() => {
        fetchPendingEvents();
    }, []);

    // 承認/却下処理
    const handleStatusUpdate = async (eventId, newStatus) => {
        let confirmationMessage = `イベントID ${eventId} を「${newStatus === 'approved' ? '承認' : '却下'}」しますか？`;
        let requestBody = { status: newStatus };
        
        // 却下の場合、理由を入力させる
        if (newStatus === 'rejected') {
            const reason = window.prompt("却下する理由を入力してください（任意）:");
            if (reason === null) {
                return; // キャンセルされた場合
            }
            requestBody.reason = reason; 
            if (reason.trim() !== '') {
                confirmationMessage = `イベントID ${eventId} を理由「${reason.substring(0, 20)}...」で却下しますか？`;
            }
        }

        if (!window.confirm(confirmationMessage)) {
            return;
        }

        try {
            const token = localStorage.getItem("token"); // ← トークン取得
            const response = await fetch(`${API_URL}/${eventId}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // ← Bearerトークンを送信
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                alert(`${newStatus === 'approved' ? '承認' : '却下'}が完了しました。`);
                
                setPendingEvents(prev => prev.filter(event => event.id !== eventId));
                
                if (onUpdate) {
                    onUpdate(); 
                }

            } else {
                const errorData = await response.json();
                alert(`処理に失敗しました。ステータスコード: ${response.status}\nエラー: ${errorData.message || errorData.error || '不明なエラー'}`);
                console.error("APIエラー詳細:", errorData);
            }
        } catch (error) {
            alert(`ネットワークエラーが発生しました: ${error.message}`);
        }
    };

    if (loading) {
        return <p>イベント申請データを読み込み中...</p>;
    }

    return (
        <div style={{ padding: "10px" }}>
            <h3>承認待ちイベント ({pendingEvents.length} 件)</h3>
            
            {pendingEvents.length === 0 ? (
                <p style={{ color: "green", fontWeight: "bold" }}>
                    現在、承認待ちのイベント申請はありません。
                </p>
            ) : (
                pendingEvents.map((event) => (
                    <div
                        key={event.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "15px",
                            marginBottom: "15px",
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                    >
                        {/* タイトルと詳細切り替え */}
                        <div
                            onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                            style={{ 
                                cursor: "pointer", 
                                fontWeight: "bold", 
                                fontSize: "18px", 
                                color: "#333" 
                            }}
                        >
                            {event.name || `イベント #${event.id}`} 
                            <span style={{ float: 'right', color: '#888' }}>
                                {expandedId === event.id ? '▲ 詳細を閉じる' : '▼ 詳細を見る'}
                            </span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                            申請者ID: {event.user_id} | 申請日時: {new Date(event.created_at).toLocaleString()}
                        </p>

                        {/* 詳細情報 */}
                        {expandedId === event.id && (
                            <div style={{ marginTop: "10px", padding: "10px", borderTop: "1px dashed #eee" }}>
                                <p><strong>見出し:</strong> {event.catchphrase}</p>
                                <p><strong>開催期間:</strong> {event.start_date} から {event.end_date}</p>
                                <p><strong>場所:</strong> {event.location}</p>
                                <p><strong>予約:</strong> 
                                    {Number(event.is_free_participation) === 0 ? "要予約" 
                                    : Number(event.is_free_participation) === 1 ? "自由参加" 
                                    : "未設定"}
                                    </p>

                                <p><strong>URL:</strong> <a href={event.url} target="_blank" rel="noopener noreferrer">{event.url}</a></p>
                                <p><strong>主催者:</strong> {event.organizer}</p>
                                <p><strong>詳細:</strong> {event.description || '記載なし'}</p>
                                <p><strong>注意事項:</strong> {event.notes || '記載なし'}</p>
                                
                                {event.image_url && (
                                    <div style={{ marginTop: '10px' }}>
                                        <strong>見出し画像:</strong>
                                        <img 
                                            src={event.image_url} 
                                            alt="イベント画像" 
                                            style={{ 
                                                maxWidth: '100%', 
                                                maxHeight: '200px', 
                                                display: 'block', 
                                                marginTop: '5px',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    </div>
                                )}

                                {/* アクションボタン */}
                                <div style={{ marginTop: "20px", textAlign: "right" }}>
                                    <button
                                        onClick={() => handleStatusUpdate(event.id, 'rejected')}
                                        style={{ 
                                            padding: "8px 15px", 
                                            backgroundColor: "#f44336", 
                                            color: "white", 
                                            border: "none", 
                                            borderRadius: "5px", 
                                            marginRight: "10px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        却下 ❌
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(event.id, 'approved')}
                                        style={{ 
                                            padding: "8px 15px", 
                                            backgroundColor: "#4CAF50", 
                                            color: "white", 
                                            border: "none", 
                                            borderRadius: "5px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        承認 ✅
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}