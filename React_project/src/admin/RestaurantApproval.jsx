import React, { useState, useEffect } from "react";

// APIのエンドポイント
const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/restaurants`;

export default function RestaurantApproval({ onUpdate }) {
    const [pendingShops, setPendingShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    // 承認待ちレストランのデータを取得
    const fetchPendingShops = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/pending`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setPendingShops(data);
            } else {
                console.error("承認待ちデータの取得に失敗しました。");
                setPendingShops([]);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            setPendingShops([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingShops();
    }, []);

    // 承認/却下処理
    const handleStatusUpdate = async (id, newStatus) => {
        let confirmationMessage = `このレストランを「${newStatus === 'approved' ? '承認' : '却下'}」しますか？`;
        let rejectionReason = null;

        if (newStatus === 'rejected') {
            rejectionReason = window.prompt("却下する理由を入力してください（任意）:");
            if (rejectionReason === null) return; 

            if (rejectionReason.trim() !== '') {
                confirmationMessage = `このレストランを理由「${rejectionReason.substring(0, 20)}...」で却下しますか？`;
            }
        }

        if (!window.confirm(confirmationMessage)) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/${id}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    status: newStatus, // バックエンドに合わせて approval_status_id か status か調整してください
                    reason: rejectionReason 
                }),
            });

            if (response.ok) {
                alert(`${newStatus === 'approved' ? '承認' : '却下'}が完了しました。`);
                setPendingShops(prev => prev.filter(s => s.id !== id));
                if (onUpdate) onUpdate();
            } else {
                alert("処理に失敗しました。");
            }
        } catch (error) {
            alert("通信エラーが発生しました。");
        }
    };

    if (loading) return <p style={{ padding: "20px" }}>レストラン申請データを読み込み中...</p>;

    return (
        <div style={{ padding: "10px" }}>
            <h3 style={{ marginBottom: "20px" }}>
                承認待ちレストラン ({pendingShops.length} 件)
            </h3>
            
            {pendingShops.length === 0 ? (
                <p style={{ color: "green", fontWeight: "bold" }}>
                    現在、承認待ちのレストラン申請はありません。
                </p>
            ) : (
                pendingShops.map((shop) => {
                    const isResubmitted = Number(shop.approval_status_id) === 3;

                    return (
                        <div
                            key={shop.id}
                            style={{
                                border: "1px solid #ddd",
                                // 再申請の場合は左端をオレンジに（EventApprovalと同じ演出）
                                borderLeft: isResubmitted ? "6px solid #faad14" : "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "15px",
                                marginBottom: "15px",
                                backgroundColor: "#fff",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                            }}
                        >
                            {/* ヘッダー部分（クリックで開閉） */}
                            <div
                                onClick={() => setExpandedId(expandedId === shop.id ? null : shop.id)}
                                style={{ 
                                    cursor: "pointer", 
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <strong style={{ fontSize: "18px", color: "#333" }}>
                                    {shop.name || `レストラン #${shop.id}`}
                                </strong>

                                {isResubmitted && (
                                    <span style={resubmitBadgeStyle}>再申請</span>
                                )}

                                <span style={{ marginLeft: 'auto', color: '#888', fontSize: '14px' }}>
                                    {expandedId === shop.id ? '▲ 閉じる' : '▼ 詳細表示'}
                                </span>
                            </div>

                            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                エリア: {shop.area?.name || "未設定"} | ジャンル: {shop.genre?.name || "未設定"} | 更新: {new Date(shop.updated_at).toLocaleString()}
                            </p>

                            {/* 詳細情報（アコーディオン） */}
                            {expandedId === shop.id && (
                                <div style={{ marginTop: "15px", padding: "10px", borderTop: "1px dashed #eee" }}>
                                    
                                    {/* 前回の却下理由（再申請時のみ） */}
                                    {isResubmitted && shop.rejection_reason && (
                                        <div style={rejectionBoxStyle}>
                                            <strong style={{ color: "#cf1322" }}>前回の却下理由：</strong>
                                            <p style={{ margin: "5px 0 0", color: "#cf1322" }}>{shop.rejection_reason}</p>
                                        </div>
                                    )}

                                    {/* 画像ギャラリー */}
                                    <div style={imageGalleryStyle}>
                                        <div style={imageWrapper}>
                                            <small style={imageLabel}>トップ画像</small>
                                            {shop.topimage_path ? <img src={shop.topimage_path} alt="TOP" style={thumbStyle} /> : <div style={noImage}>No Image</div>}
                                        </div>
                                        {[1, 2, 3].map(i => (
                                            <div key={i} style={imageWrapper}>
                                                <small style={imageLabel}>サブ画像 {i}</small>
                                                {shop[`image${i}_path`] ? <img src={shop[`image${i}_path`]} alt={`Sub ${i}`} style={thumbStyle} /> : <div style={noImage}>No Image</div>}
                                            </div>
                                        ))}
                                    </div>

                                    {/* スペック情報 */}
                                    <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "5px", fontSize: "14px" }}>
                                        <strong>キャッチコピー:</strong> <span>{shop.catchphrase || "未設定"}</span>
                                        <strong>住所:</strong> <span>{shop.address || "未設定"}</span>
                                        <strong>TEL:</strong> <span>{shop.tel || "未設定"}</span>
                                        <strong>営業時間:</strong> <span>{shop.business_hours || "未設定"}</span>
                                        <strong>定休日:</strong> <span>{shop.holiday || "未設定"}</span>
                                        <strong>予算:</strong> <span>{shop.budget?.name || "未設定"}</span>
                                        <strong>URL:</strong> <a href={shop.url} target="_blank" rel="noopener noreferrer">{shop.url}</a>
                                    </div>

                                    <div style={{ marginTop: "10px" }}>
                                        <strong>コメント:</strong>
                                        <p style={commentBoxStyle}>{shop.comment || '記載なし'}</p>
                                    </div>

                                    {/* アクションボタン */}
                                    <div style={{ marginTop: "20px", textAlign: "right" }}>
                                        <button
                                            onClick={() => handleStatusUpdate(shop.id, 'rejected')}
                                            style={rejectButtonStyle}
                                        >
                                            却下する
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(shop.id, 'approved')}
                                            style={approveButtonStyle}
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

// --- スタイル（EventApprovalと共通のトーン） ---

const resubmitBadgeStyle = { 
    backgroundColor: "#faad14", 
    color: "white", 
    fontSize: "12px", 
    padding: "2px 10px", 
    borderRadius: "12px", 
    marginLeft: "10px",
    fontWeight: "bold"
};

const rejectionBoxStyle = { 
    backgroundColor: "#fff0f0", 
    padding: "10px", 
    borderRadius: "5px", 
    marginBottom: "15px", 
    border: "1px solid #ffccc7" 
};

const imageGalleryStyle = { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: "15px" };
const imageWrapper = { textAlign: "center" };
const imageLabel = { display: "block", fontSize: "10px", color: "#888", marginBottom: "2px" };
const thumbStyle = { width: "100px", height: "70px", objectFit: "cover", borderRadius: "4px", border: "1px solid #eee" };
const noImage = { width: '100px', height: '70px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#ccc', borderRadius: '4px' };

const commentBoxStyle = { whiteSpace: "pre-wrap", marginTop: "5px", fontSize: "13px", color: "#555", backgroundColor: "#f9f9f9", padding: "8px", borderRadius: "4px" };

const approveButtonStyle = { 
    padding: "8px 20px", backgroundColor: "#4CAF50", color: "white", 
    border: "none", borderRadius: "5px", cursor: "pointer", marginLeft: "10px"
};

const rejectButtonStyle = { 
    padding: "8px 20px", backgroundColor: "#f44336", color: "white", 
    border: "none", borderRadius: "5px", cursor: "pointer"
};