// EventManagement.js

import React, { useState, useEffect } from "react";
import EventApproval from './EventApproval.jsx'; // EventApprovalコンポーネントをインポート

// EventApproval.js と同じAPI_URLを使用
const API_URL = "/api/admin/events"; 

// --- 公開中・非公開リスト用コンポーネント ---
function EventList({ status, title, onStatusUpdate }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const today = new Date();
    const [selectedYearMonth, setSelectedYearMonth] = useState(
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
    );

    const generateYearMonthOptions = () => {
        const options = [];
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;

        // 過去1年間までを生成
        for (let y = currentYear; y >= currentYear - 1; y--) {
            const startMonth = (y === currentYear) ? currentMonth : 12;
            for (let m = startMonth; m >= 1; m--) {
                const monthString = String(m).padStart(2, '0');
                const value = `${y}-${monthString}`;
                options.push({
                    value: value,
                    label: `${y}年${m}月`
                });
                if (y < currentYear && m === 1) break; // 1年前までで停止
            }
        }
        return options;
    };
    
    const yearMonthOptions = generateYearMonthOptions();

    const fetchApprovedEvents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token"); 
            const url = `${API_URL}/approved?year_month=${selectedYearMonth}`;
            
            const response = await fetch(url, {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
            });
            if (response.ok) {
                const data = await response.json();
                setApprovedEvents(data);
            } else {
                console.error("承認済みイベントの取得に失敗しました。");
            }
        } catch (error) {
            console.error("通信エラー:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (e, id, newStatus) => {
        e.stopPropagation();
        const msg = newStatus === 1 ? "このイベントを再度【公開】しますか？" : "このイベントを【非公開】にしますか？";
        if (!window.confirm(msg)) return;
        
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/${id}/status`, {
                method: "POST", 
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setEvents(prev => prev.filter((e) => e.id !== id));
                alert(newStatus === 1 ? "公開しました。" : "非公開にしました。");
                if (onStatusUpdate) onStatusUpdate();
            }
        } catch (err) {
            console.error("Update Error:", err);
        }
    };

    if (loading) return <p>承認済みイベントを読み込み中...</p>;

    return (
        <div style={{ padding: "10px" }}>
            <h4 style={{ marginBottom: "15px" }}>{title} ({events.length} 件)</h4>
            
            <div style={{ marginBottom: '15px' }}>
                <label style={{ marginRight: '10px' }}>表示年月：</label>
                <select 
                    value={selectedYearMonth} 
                    onChange={handleYearMonthChange}
                    style={{ padding: '5px', borderRadius: '4px' }}
                >
                    {yearMonthOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            
            {events.length === 0 ? (
                <p style={{ color: "#888", padding: "10px" }}>該当するイベントはありません。</p>
            ) : (
                events.map(event => {
                    const isResubmitted = Number(event.approval_status_id) === 3;
                    return (
                        <div key={event.id} style={{
                            ...cardStyle,
                            // borderLeftの色は不要とのことなので統一
                            borderLeft: "1px solid #ddd" 
                        }}>
                            <div 
                                onClick={() => setExpandedId(expandedId === event.id ? null : event.id)} 
                                style={cardHeaderStyle}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <strong style={{ color: status === 9 ? "#666" : "#333" }}>{event.name}</strong> 
                                    {isResubmitted ? (
                                        <span style={resubmitBadgeStyle}>再申請経由</span>
                                    ) : (
                                        <span style={newBadgeStyle}>新規申請経由</span>
                                    )}
                                </div>
                                <span style={{ float: 'right', color: '#333', fontWeight: 'normal', fontSize: '14px' }}>
                                    {expandedId === event.id ? "▲ 閉じる" : "▼ 詳細編集・公開設定"}
                                </span>
                            </div>
                            <p style={cardSubTextStyle}>
                                ({event.start_date.substring(0, 16)} ～) | 場所: {event.location}
                            </p>

                            {expandedId === event.id && (
                                <div style={cardDetailStyle}>
                                    <div style={{ marginBottom: "20px" }}>
                                        <p style={{ fontWeight: "bold", borderBottom: "1px solid #eee", paddingBottom: "5px", marginBottom: "10px" }}>見出し画像</p>
                                        <div>
                                            {event.image_path ? (
                                                <img src={event.image_path} alt="Event" style={thumbStyleLarge} />
                                            ) : (
                                                <div style={noImage}>No Image</div>
                                            )}
                                        </div>
                                    </div>

                                    <div style={infoGridStyle}>
                                        <p><strong>イベント名:</strong> {event.name}</p>
                                        <p><strong>見出し:</strong> {event.catchphrase}</p>
                                        <p><strong>開始日時:</strong> {event.start_date}</p>
                                        <p><strong>終了日時:</strong> {event.end_date}</p>
                                        <p><strong>場所:</strong> {event.location}</p>
                                        <p><strong>予約:</strong> 
                                            {Number(event.is_free_participation) === 1 
                                                ? <span style={{color: "green", fontWeight: "bold", marginLeft: "5px"}}>自由参加</span> 
                                                : <span style={{color: "orange", fontWeight: "bold", marginLeft: "5px"}}>要予約</span>
                                            }
                                        </p>
                                        <p><strong>主催者:</strong> {event.organizer}</p>
                                        <p><strong>URL:</strong> 
                                            {event.url && event.url !== "なし" ? (
                                                <a href={event.url} target="_blank" rel="noreferrer" style={{ wordBreak: "break-all" }}>{event.url}</a>
                                            ) : "なし"}
                                        </p>
                                    </div>

                                    <div style={{ marginTop: "15px", padding: "12px", backgroundColor: "#fff", borderRadius: "4px", border: "1px solid #eee" }}>
                                        <strong style={{ display: "block", marginBottom: "5px" }}>イベント詳細:</strong>
                                        <p style={{ whiteSpace: "pre-wrap", margin: 0, lineHeight: "1.5", color: "#333", fontSize: "14px" }}>
                                            {event.description || "（入力なし）"}
                                        </p>
                                    </div>

                                    <div style={{ marginTop: "10px", padding: "12px", backgroundColor: "#fffbe6", borderRadius: "4px", border: "1px solid #ffe58f" }}>
                                        <strong style={{ display: "block", marginBottom: "5px", color: "#856404" }}>注意事項:</strong>
                                        <p style={{ whiteSpace: "pre-wrap", margin: 0, lineHeight: "1.5", color: "#856404", fontSize: "14px" }}>
                                            {event.notes || "（入力なし）"}
                                        </p>
                                    </div>

                                    <div style={actionAreaStyle}>
                                        <button 
                                            onClick={() => navigate(`/EventEdit/${event.id}`, { state: { fromAdmin: true } })}
                                            style={editButtonStyle}
                                        >
                                            編集 ✏️
                                        </button>
                                        
                                        <button 
                                            onClick={(e) => handleUpdateStatus(e, event.id, status === 1 ? 9 : 1)}
                                            style={status === 1 ? hideButtonStyle : showButtonStyle}
                                        >
                                            {status === 1 ? "非公開にする" : "再公開する"}
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


// --- イベント管理メインコンポーネント (export default) ---

export default function EventManagement({ onStatusUpdate }) {
    const [eventTab, setEventTab] = useState("pending");
    
    const tabStyle = (id) => ({
        padding: '10px 20px', border: 'none',
        borderBottom: eventTab === id ? '3px solid #f93d5d' : '3px solid transparent',
        background: 'none', cursor: 'pointer',
        fontWeight: eventTab === id ? 'bold' : 'normal',
        color: eventTab === id ? '#f93d5d' : '#666',
        transition: 'all 0.3s ease',
    });

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <h2 style={{ paddingLeft: '15px', marginBottom: '25px' }}>イベント管理</h2>

            <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', display: 'flex' }}>
                <button onClick={() => setEventTab("pending")} style={tabStyle("pending")}>未承認</button>
                <button onClick={() => setEventTab("approved")} style={tabStyle("approved")}>公開中</button>
                <button onClick={() => setEventTab("hidden")} style={tabStyle("hidden")}>非公開</button>
            </div>
            
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', minHeight: '300px' }}>
                {eventTab === "pending" && <EventApproval onUpdate={onStatusUpdate} />}
                {eventTab === "approved" && (
                    <EventList status={1} title="公開中のイベント" onStatusUpdate={onStatusUpdate} />
                )}
                {eventTab === "hidden" && (
                    <EventList status={9} title="非公開のイベント" onStatusUpdate={onStatusUpdate} />
                )}
            </div>
        </div>
    );
}

// --- スタイル定義 (飲食店管理と完全に統一) ---
// 枠を太くしたい場合はここの border: "1px..." を "2px..." に変更してください
const cardStyle = { 
    border: "1px solid #ddd", 
    borderRadius: "8px", 
    padding: "15px", 
    marginBottom: "15px", 
    backgroundColor: "#fff", 
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)", 
    position: 'relative' 
};

const cardHeaderStyle = { 
    cursor: "pointer", 
    fontWeight: "bold", 
    fontSize: "18px", 
    color: "#333", 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center" 
};

const cardSubTextStyle = { 
    fontSize: '12px', 
    color: '#666', 
    marginTop: '5px' 
};

const cardDetailStyle = { 
    marginTop: "10px", 
    padding: "10px", 
    borderTop: "1px dashed #eee" 
};

const resubmitBadgeStyle = { 
    backgroundColor: "#faad14", 
    color: "white", 
    fontSize: "11px", 
    padding: "2px 8px", 
    borderRadius: "10px", 
    marginLeft: "10px" 
};

const newBadgeStyle = { 
    backgroundColor: "#1890ff", 
    color: "white", 
    fontSize: "11px", 
    padding: "2px 8px", 
    borderRadius: "10px", 
    marginLeft: "10px" 
};

const infoGridStyle = { 
    fontSize: "14px", 
    lineHeight: "1.8", 
    color: "#444" 
};

const actionAreaStyle = { 
    marginTop: "20px", 
    textAlign: "right", 
    borderTop: "1px solid #eee", 
    paddingTop: "15px" 
};

const thumbStyleLarge = { 
    maxWidth: "300px", 
    height: "auto", 
    borderRadius: "6px", 
    border: "1px solid #ddd" 
};

const noImage = { 
    width: '150px', 
    height: '100px', 
    backgroundColor: '#eee', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontSize: '12px', 
    color: '#999', 
    borderRadius: '6px' 
};

const editButtonStyle = { 
    padding: "8px 16px", 
    backgroundColor: "#6c757d", 
    color: "#fff", 
    border: "none", 
    borderRadius: "4px", 
    marginRight: "10px", 
    fontWeight: "bold", 
    cursor: "pointer" 
};

const hideButtonStyle = { 
    padding: "8px 16px", 
    backgroundColor: "#dc3545", 
    color: "white", 
    border: "none", 
    borderRadius: "4px", 
    fontWeight: "bold", 
    cursor: "pointer" 
};

const showButtonStyle = { 
    padding: "8px 16px", 
    backgroundColor: "#28a745", 
    color: "white", 
    border: "none", 
    borderRadius: "4px", 
    fontWeight: "bold", 
    cursor: "pointer" 
};
