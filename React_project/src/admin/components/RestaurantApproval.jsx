import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};
const API_URL = `${getBaseApiUrl()}/admin/restaurants`;

// --- 公開・非公開リスト用 (RestaurantList) ---
export function RestaurantList({ status, title, onStatusUpdate }) {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const navigate = useNavigate();

    const today = new Date();
    const [selectedYearMonth, setSelectedYearMonth] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`);

    const fetchShops = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("admintoken");
            // 公開中(2)などを取得
            const url = `${API_URL}/approved?year_month=${selectedYearMonth}&status=${status}`;
            const response = await fetch(url, { 
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" } 
            });
            if (response.ok) setShops(await response.json());
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const handleToggleStatus = async (e, id, newStatus) => {
        e.stopPropagation();
        if (!window.confirm("状態を変更しますか？")) return;
        try {
            const token = localStorage.getItem("admintoken");
            const res = await fetch(`${API_URL}/${id}/status`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ approval_status_id: newStatus })
            });
            if (res.ok) {
                setShops(prev => prev.filter(s => s.id !== id));
                if (onStatusUpdate) onStatusUpdate();
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchShops(); }, [selectedYearMonth, status]);

    if (loading) return <p style={{ padding: "20px" }}>読み込み中...</p>;

    return (
        <div style={{ padding: "10px" }}>
            <h4 style={{ marginBottom: "15px" }}>{title} ({shops.length} 件)</h4>
            <div style={{ marginBottom: '15px' }}>
                <select value={selectedYearMonth} onChange={(e) => setSelectedYearMonth(e.target.value)} style={{ padding: '5px', borderRadius: '4px' }}>
                    {Array.from({ length: 12 }).map((_, i) => {
                        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                        const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                        return <option key={val} value={val}>{d.getFullYear()}年{d.getMonth() + 1}月</option>;
                    })}
                </select>
            </div>
            {shops.length === 0 ? (
                <p style={{ color: "#888", padding: "10px" }}>該当する店舗はありません。</p>
            ) : (
                shops.map(shop => (
                    <div key={shop.id} style={cardStyle}>
                        <div onClick={() => setExpandedId(expandedId === shop.id ? null : shop.id)} style={cardHeaderStyle}>
                            <strong>{shop.name}</strong>
                            <span style={{ color: '#888', fontSize: '14px' }}>
                                {expandedId === shop.id ? "▲ 閉じる" : "▼ 詳細を表示"}
                            </span>
                        </div>
                        <p style={cardSubTextStyle}>住所: {shop.address} | 地域: {shop.area?.name || "未設定"}</p>
                        
                        {expandedId === shop.id && (
                            <div style={cardDetailStyle}>
                                <div style={imageGalleryStyle}>
                                    <div style={imageWrapper}><small style={imageLabel}>トップ画像</small>{shop.topimage_path ? <img src={shop.topimage_path} alt="TOP" style={thumbStyle} /> : <div style={noImage}>No Image</div>}</div>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} style={imageWrapper}><small style={imageLabel}>画像 {i}</small>{shop[`image${i}_path`] ? <img src={shop[`image${i}_path`]} alt={`Sub ${i}`} style={thumbStyle} /> : <div style={noImage}>No Image</div>}</div>
                                    ))}
                                </div>

                                <div style={infoGridStyle}>
                                    <p><strong>住所:</strong> {shop.address}</p>
                                    <p><strong>座標:</strong> 緯度: {shop.latitude || "未設定"} / 経度: {shop.longitude || "未設定"}</p>
                                    <p><strong>ジャンル:</strong> {shop.genre?.name || "未設定"}</p>
                                    <p><strong>予算:</strong> {shop.budget?.name || "未設定"}</p>
                                    <p><strong>電話番号:</strong> {shop.tel}</p>
                                    <p><strong>営業時間:</strong> {shop.business_hours}</p>
                                    <p><strong>定休日:</strong> {shop.holiday}</p>
                                    <p><strong>URL:</strong> {shop.url !== "なし" ? <a href={shop.url} target="_blank" rel="noreferrer">{shop.url}</a> : "なし"}</p>
                                    <p><strong>詳細:</strong></p>
                                    <div style={commentBoxStyle}>{shop.comment || 'なし'}</div>
                                </div>
                                <div style={actionAreaStyle}>
                                    <button onClick={() => navigate(`/RestaurantEdit/${shop.id}`, { state: { fromAdmin: true } })} style={editButtonStyle}>編集</button>
                                    {/* 公開中(2)なら非公開(9)へ。status変数と比較して切り替え */}
                                    <button onClick={(e) => handleToggleStatus(e, shop.id, Number(status) === 2 ? 9 : 2)} style={Number(status) === 2 ? hideButtonStyle : showButtonStyle}>
                                        {Number(status) === 2 ? "非公開にする" : "再公開する"}
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

// --- 承認待ち用 (RestaurantApproval) ---
export default function RestaurantApproval({ onUpdate }) {
    const [pendingShops, setPendingShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const navigate = useNavigate();

    const fetchPendingShops = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("admintoken");
            const response = await fetch(`${API_URL}/pending`, {
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
            });
            if (response.ok) setPendingShops(await response.json());
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    useEffect(() => { fetchPendingShops(); }, []);

    const handleStatusUpdate = async (shopId, statusId) => {
        let rejectionReason = null;
        // 設計通り 3 が却下
        if (statusId === 3) {
            rejectionReason = window.prompt("却下する理由を入力してください:");
            if (rejectionReason === null) return;
        }
        
        // メッセージを分かりやすく修正
        const actionLabel = statusId === 2 ? '承認して公開' : '却下';
        if (!window.confirm(`この店舗を${actionLabel}しますか？`)) return;

        try {
            const token = localStorage.getItem("admintoken");
            const response = await fetch(`${API_URL}/${shopId}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
                body: JSON.stringify({ approval_status_id: statusId, rejection_reason: rejectionReason }),
            });
            if (response.ok) {
                alert("更新が完了しました。");
                // リストから消す
                setPendingShops(prev => prev.filter(shop => shop.id !== shopId));
                if (onUpdate) onUpdate(); 
            } else {
                const err = await response.json();
                alert(`エラー: ${err.message || "更新に失敗しました"}`);
            }
        } catch (error) { alert("ネットワークエラーが発生しました。"); }
    };

    if (loading) return <p style={{ padding: "20px" }}>読み込み中...</p>;

    return (
        <div style={{ padding: "10px" }}>
            <h3 style={{ marginBottom: "15px" }}>承認待ち店舗 ({pendingShops.length} 件)</h3>
            {pendingShops.length === 0 ? (
                <p style={{ color: "green", fontWeight: "bold" }}>現在、承認待ちの申請はありません。</p>
            ) : (
                pendingShops.map((shop) => {
                    // 再申請の判定（以前に却下理由がある、かつ現在ステータス1）
                    const isResubmitted = shop.rejection_reason !== null;
                    return (
                        <div key={shop.id} style={{ ...cardStyle, backgroundColor: isResubmitted ? "#fffaf0" : "#fff" }}>
                            <div onClick={() => setExpandedId(expandedId === shop.id ? null : shop.id)} style={cardHeaderStyle}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                                    <span>{shop.name}</span>
                                    {isResubmitted ? <span style={resubmitBadgeStyle}>再申請</span> : <span style={newBadgeStyle}>新規申請</span>}
                                </div>
                                <span style={{ color: '#888', fontSize: '14px' }}>
                                    {expandedId === shop.id ? '▲ 閉じる' : '▼ 詳細を見る'}
                                </span>
                            </div>
                            <div style={cardSubTextStyle}>申請日: {shop.created_at?.substring(0, 10)}</div>
                            
                            {expandedId === shop.id && (
                                <div style={cardDetailStyle}>
                                    <div style={imageGalleryStyle}>
                                        <div style={imageWrapper}><small style={imageLabel}>トップ画像</small>{shop.topimage_path ? <img src={shop.topimage_path} alt="TOP" style={thumbStyle} /> : <div style={noImage}>No Image</div>}</div>
                                        {[1, 2, 3].map(i => (
                                            <div key={i} style={imageWrapper}><small style={imageLabel}>画像 {i}</small>{shop[`image${i}_path`] ? <img src={shop[`image${i}_path`]} alt={`Sub ${i}`} style={thumbStyle} /> : <div style={noImage}>No Image</div>}</div>
                                        ))}
                                    </div>

                                    <div style={infoGridStyle}>
                                        <p><strong>住所:</strong> {shop.address}</p>
                                        <p><strong>座標:</strong> 緯度: {shop.latitude || "未設定"} / 経度: {shop.longitude || "未設定"}</p>
                                        <p><strong>ジャンル:</strong> {shop.genre?.name || "未設定"}</p>
                                        <p><strong>予算:</strong> {shop.budget?.name || "未設定"}</p>
                                        <p><strong>電話番号:</strong> {shop.tel}</p>
                                        <p><strong>営業時間:</strong> {shop.business_hours}</p>
                                        <p><strong>定休日:</strong> {shop.holiday}</p>
                                        <p><strong>URL:</strong> {shop.url !== "なし" ? <a href={shop.url} target="_blank" rel="noreferrer">{shop.url}</a> : "なし"}</p>
                                        <p><strong>詳細:</strong></p>
                                        <div style={commentBoxStyle}>{shop.comment || 'なし'}</div>
                                    </div>
                                    <div style={actionAreaStyle}>
                                        <button onClick={() => navigate(`/RestaurantEdit/${shop.id}`, { state: { fromAdmin: true } })} style={editButtonStyle}>編集</button>
                                        {/* 却下は 3 を送る */}
                                        <button onClick={() => handleStatusUpdate(shop.id, 3)} style={rejectButtonStyle}>却下する</button>
                                        {/* 承認は 2 を送る */}
                                        <button onClick={() => handleStatusUpdate(shop.id, 2)} style={approveButtonStyle}>承認して公開</button>
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

// --- スタイル定義 (変更なし) ---
const cardStyle = { border: "1px solid #ddd", borderRadius: "8px", padding: "15px", marginBottom: "15px", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", position: 'relative' };
const cardHeaderStyle = { cursor: "pointer", fontWeight: "bold", fontSize: "18px", color: "#333", display: "flex", justifyContent: "space-between", alignItems: "flex-start" };
const cardSubTextStyle = { fontSize: '12px', color: '#666', marginTop: '5px' };
const cardDetailStyle = { marginTop: "10px", padding: "10px", borderTop: "1px dashed #eee" };
const resubmitBadgeStyle = { backgroundColor: "#faad14", color: "white", fontSize: "11px", padding: "2px 8px", borderRadius: "10px", marginTop: "2px" };
const newBadgeStyle = { backgroundColor: "#1890ff", color: "white", fontSize: "11px", padding: "2px 8px", borderRadius: "10px", marginTop: "2px" };
const imageGalleryStyle = { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: "20px" };
const imageWrapper = { textAlign: "center" };
const imageLabel = { display: "block", fontSize: "10px", color: "#888", marginBottom: "4px" };
const thumbStyle = { width: "110px", height: "80px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd" };
const noImage = { width: '110px', height: '80px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#999', borderRadius: '6px' };
const infoGridStyle = { fontSize: "14px", lineHeight: "1.8", color: "#444" };
const commentBoxStyle = { backgroundColor: "#f9f9f9", padding: "10px", borderRadius: "4px", border: "1px solid #eee", whiteSpace: "pre-wrap", marginTop: "5px" };
const actionAreaStyle = { marginTop: "20px", textAlign: "right", borderTop: "1px solid #eee", paddingTop: "15px" };
const approveButtonStyle = { padding: "8px 15px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" };
const rejectButtonStyle = { padding: "8px 15px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "5px", marginRight: "10px", cursor: "pointer", fontWeight: "bold" };
const editButtonStyle = { padding: "8px 16px", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", marginRight: "10px", fontWeight: "bold", cursor: "pointer" };
const hideButtonStyle = { padding: "8px 16px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" };
const showButtonStyle = { padding: "8px 16px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" };

