//飲食店承認管理
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * APIのベースURLを安全に構築
 */
const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

const API_URL = `${getBaseApiUrl()}/admin/restaurants`;

// --- 承認待ちコンポーネント ---
function RestaurantApproval({ onUpdate }) {
    const [pendingShops, setPendingShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const navigate = useNavigate(); // ナビゲーション用に追加

    const fetchPendingShops = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("admintoken");
            const response = await fetch(`${API_URL}/pending`, {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
            });
            if (response.ok) {
                const data = await response.json();
                setPendingShops(data);
            }
        } catch (error) {
            console.error("通信エラー:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPendingShops(); }, []);

    const handleStatusUpdate = async (shopId, statusId) => {
        let rejectionReason = null;
        if (statusId === 2) {
            rejectionReason = window.prompt("却下する理由を入力してください:");
            if (rejectionReason === null) return;
        }
        if (!window.confirm(`この店舗を${statusId === 1 ? '承認' : '却下'}しますか？`)) return;

        try {
            const token = localStorage.getItem("admintoken");
            const response = await fetch(`${API_URL}/${shopId}/status`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ approval_status_id: statusId, rejection_reason: rejectionReason }),
            });
            if (response.ok) {
                alert("更新が完了しました。");
                setPendingShops(prev => prev.filter(shop => shop.id !== shopId));
                if (onUpdate) onUpdate(); 
            }
        } catch (error) { alert("エラーが発生しました。"); }
    };

    if (loading) return <p style={{ padding: "20px" }}>飲食店申請データを読み込み中...</p>;

    return (
        <div style={{ padding: "10px" }}>
            <h3 style={{ marginBottom: "15px" }}>承認待ち店舗 ({pendingShops.length} 件)</h3>
            {pendingShops.length === 0 ? (
                <p style={{ color: "green", fontWeight: "bold" }}>現在、承認待ちの店舗申請はありません。</p>
            ) : (
                pendingShops.map((shop) => {
                    const isResubmitted = Number(shop.approval_status_id) === 3;
                    return (
                        <div key={shop.id} style={{
                            ...cardStyle,
                            backgroundColor: isResubmitted ? "#fffaf0" : "#fff",
                        }}>
                            <div onClick={() => setExpandedId(expandedId === shop.id ? null : shop.id)} style={cardHeaderStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {shop.name || `店舗 #${shop.id}`}
                                    {isResubmitted ? <span style={resubmitBadgeStyle}>再申請</span> : <span style={newBadgeStyle}>新規申請</span>}
                                </div>
                                <span style={{ float: 'right', color: '#888', fontWeight: 'normal', fontSize: '14px' }}>
                                    {expandedId === shop.id ? '▲ 閉じる' : '▼ 詳細を見る'}
                                </span>
                            </div>
                            <p style={cardSubTextStyle}>
                                申請者ID: {shop.user_id} | 申請日時: {shop.created_at ? new Date(shop.created_at).toLocaleString() : "不明"}
                            </p>
                            {expandedId === shop.id && (
                                <div style={cardDetailStyle}>
                                    {isResubmitted && shop.rejection_reason && (
                                        <div style={rejectionBoxStyle}>
                                            <strong>⚠️ 前回の却下理由:</strong> {shop.rejection_reason}
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
                                                <small style={imageLabel}>外観・内観画像 {i}</small>
                                                {shop[`image${i}_path`] ? <img src={shop[`image${i}_path`]} alt={`Sub ${i}`} style={thumbStyle} /> : <div style={noImage}>No Image</div>}
                                            </div>
                                        ))}
                                    </div>

                                    {/* 情報グリッド */}
                                    <div style={infoGridStyle}>
                                        <p><strong>店名:</strong> {shop.name}</p>
                                        <p><strong>住所:</strong> {shop.address}</p>
                                        <p><strong>座標:</strong> 緯度: {shop.latitude || "未設定"} / 経度: {shop.longitude || "未設定"}</p>
                                        <p><strong>地域:</strong> {shop.area?.name || "未設定"}</p>
                                        <p><strong>ジャンル:</strong> {shop.genre?.name || "未設定"}</p>
                                        <p><strong>予算:</strong> {shop.budget?.name || "未設定"}</p>
                                        <p><strong>電話番号:</strong> {shop.tel}</p>
                                        <p><strong>営業時間:</strong> {shop.business_hours}</p>
                                        <p><strong>定休日:</strong> {shop.holiday}</p>
                                        <p><strong>URL:</strong> {shop.url !== "なし" ? <a href={shop.url} target="_blank" rel="noreferrer">{shop.url}</a> : "なし"}</p>
                                        <p><strong>詳細コメント:</strong></p>
                                        <div style={commentBoxStyle}>{shop.comment || 'なし'}</div>
                                    </div>

                                    <div style={actionAreaStyle}>
                                        {/* 編集ボタンをここに追加 */}
                                        <button 
                                            onClick={() => navigate(`/RestaurantEdit/${shop.id}`, { state: { fromAdmin: true } })} 
                                            style={editButtonStyle}
                                        >
                                            編集 
                                        </button>
                                        <button onClick={() => handleStatusUpdate(shop.id, 2)} style={rejectButtonStyle}>却下する</button>
                                        <button onClick={() => handleStatusUpdate(shop.id, 1)} style={approveButtonStyle}>承認して公開</button>
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

// --- 公開・非公開リスト用 ---
function RestaurantList({ status, title, onStatusUpdate }) {
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
            const url = `${API_URL}/approved?year_month=${selectedYearMonth}&status=${status}`;
            const response = await fetch(url, { 
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                } 
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <strong>{shop.name}</strong>
                            </div>
                            <span style={{ float: 'right', color: '#888', fontSize: '14px', fontWeight: 'normal' }}>
                                {expandedId === shop.id ? "▲ 閉じる" : "▼ 詳細・公開設定"}
                            </span>
                        </div>
                        <p style={cardSubTextStyle}>住所: {shop.address} | 地域: {shop.area?.name || "未設定"}</p>
                        {expandedId === shop.id && (
                            <div style={cardDetailStyle}>
                                <div style={imageGalleryStyle}>
                                    <div style={imageWrapper}>
                                        <small style={imageLabel}>トップ画像</small>
                                        {shop.topimage_path ? <img src={shop.topimage_path} alt="TOP" style={thumbStyle} /> : <div style={noImage}>No Image</div>}
                                    </div>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} style={imageWrapper}>
                                            <small style={imageLabel}>画像 {i}</small>
                                            {shop[`image${i}_path`] ? <img src={shop[`image${i}_path`]} alt={`Sub ${i}`} style={thumbStyle} /> : <div style={noImage}>No Image</div>}
                                        </div>
                                    ))}
                                </div>

                                <div style={infoGridStyle}>
                                    <p><strong>座標:</strong> {shop.latitude}, {shop.longitude}</p>
                                    <p><strong>ジャンル:</strong> {shop.genre?.name || "未設定"}</p>
                                    <p><strong>予算:</strong> {shop.budget?.name || "未設定"}</p>
                                    <p><strong>電話番号:</strong> {shop.tel}</p>
                                    <p><strong>営業時間:</strong> {shop.business_hours}</p>
                                    <p><strong>定休日:</strong> {shop.holiday}</p>
                                    <p><strong>詳細:</strong> {shop.comment || 'なし'}</p>
                                </div>
                                <div style={actionAreaStyle}>
                                    <button onClick={() => navigate(`/RestaurantEdit/${shop.id}`, { state: { fromAdmin: true } })} style={editButtonStyle}>編集 ✏️</button>
                                    <button onClick={(e) => handleToggleStatus(e, shop.id, status === 1 ? 9 : 1)} style={status === 1 ? hideButtonStyle : showButtonStyle}>
                                        {status === 1 ? "非公開にする" : "再公開する"}
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

export default function RestaurantManagement({ onStatusUpdate }) {
    const [activeTab, setActiveTab] = useState("pending");
    const tabStyle = (id) => ({
        padding: '10px 20px', border: 'none', borderBottom: activeTab === id ? '3px solid #f93d5d' : '3px solid transparent',
        background: 'none', cursor: 'pointer', fontWeight: activeTab === id ? 'bold' : 'normal', color: activeTab === id ? '#f93d5d' : '#666',
        transition: 'all 0.3s ease',
    });

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <h2 style={{ paddingLeft: '15px', marginBottom: '25px' }}>飲食店管理</h2>
            <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', display: 'flex' }}>
                <button onClick={() => setActiveTab("pending")} style={tabStyle("pending")}>未承認</button>
                <button onClick={() => setActiveTab("approved")} style={tabStyle("approved")}>公開中</button>
                <button onClick={() => setActiveTab("hidden")} style={tabStyle("hidden")}>非公開</button>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', minHeight: '300px' }}>
                {activeTab === "pending" && <RestaurantApproval onUpdate={onStatusUpdate} />}
                {activeTab === "approved" && <RestaurantList status={1} title="公開中の店舗" onStatusUpdate={onStatusUpdate} />}
                {activeTab === "hidden" && <RestaurantList status={9} title="非公開の店舗" onStatusUpdate={onStatusUpdate} />}
            </div>
        </div>
    );
}

// --- スタイル定義 ---
const cardStyle = { border: "1px solid #ddd", borderRadius: "8px", padding: "15px", marginBottom: "15px", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", position: 'relative' };
const cardHeaderStyle = { cursor: "pointer", fontWeight: "bold", fontSize: "18px", color: "#333", display: "flex", justifyContent: "space-between", alignItems: "center" };
const cardSubTextStyle = { fontSize: '12px', color: '#666', marginTop: '5px' };
const cardDetailStyle = { marginTop: "10px", padding: "10px", borderTop: "1px dashed #eee" };
const resubmitBadgeStyle = { backgroundColor: "#faad14", color: "white", fontSize: "11px", padding: "2px 8px", borderRadius: "10px", marginLeft: "10px" };
const newBadgeStyle = { backgroundColor: "#1890ff", color: "white", fontSize: "11px", padding: "2px 8px", borderRadius: "10px", marginLeft: "10px" };
const rejectionBoxStyle = { backgroundColor: "#fff0f0", padding: "10px", borderRadius: "5px", marginBottom: "15px", border: "1px solid #ffccc7", color: "#cf1322", fontSize: "13px" };
const imageGalleryStyle = { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: "20px", marginTop: "10px" };
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