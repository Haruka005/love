import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventApproval from './EventApproval.jsx';

const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/events`;

// --- イベント一覧コンポーネント (公開中・非公開 共通) ---
function EventList({ status, title }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const navigate = useNavigate();
    
    const today = new Date();
    const [selectedYearMonth, setSelectedYearMonth] = useState(
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
    );

    const yearMonthOptions = (() => {
        const options = [];
        const currentYear = today.getFullYear();
        for (let y = currentYear; y >= currentYear - 1; y--) {
            for (let m = 12; m >= 1; m--) {
                const value = `${y}-${String(m).padStart(2, '0')}`;
                options.push({ value, label: `${y}年${m}月` });
            }
        }
        return options;
    })();

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token"); 
            const url = `${API_URL}/approved?year_month=${selectedYearMonth}&status=${status}`;
            const response = await fetch(url, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
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
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    status: newStatus, 
                    reason: '管理者によるステータス変更' 
                })
            });

            if (res.ok) {
                setEvents(prev => prev.filter((e) => e.id !== id));
                alert(newStatus === 1 ? "公開しました。" : "非公開にしました。");
            }
        } catch (err) {
            console.error("Update Error:", err);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [selectedYearMonth, status]);

    if (loading) return <p style={{ padding: "20px" }}>読み込み中...</p>;

    return (
        <div style={{ padding: "10px" }}>
            <h4>{title} ({events.length} 件)</h4>
            <div style={{ marginBottom: '15px' }}>
                <select 
                    value={selectedYearMonth} 
                    onChange={(e) => setSelectedYearMonth(e.target.value)}
                    style={{ padding: '5px', borderRadius: '4px' }}
                >
                    {yearMonthOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
            
            {events.length === 0 ? (
                <p style={{ color: "gray" }}>該当するイベントはありません。</p>
            ) : (
                events.map(event => (
                    <div key={event.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                        <div 
                            onClick={() => setExpandedId(expandedId === event.id ? null : event.id)} 
                            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <span>
                                <strong style={{ color: status === 9 ? "#666" : "#000" }}>{event.name}</strong> 
                                <span style={{ fontSize: '0.85em', color: '#666', marginLeft: '10px' }}>
                                    ({event.start_date}~)
                                </span>
                            </span>
                            <span style={{ color: '#007bff', fontSize: '0.8em' }}>
                                {expandedId === event.id ? "▲ 閉じる" : "▼ 詳細・操作"}
                            </span>
                        </div>

                        {/* --- 詳細表示（全項目網羅） --- */}
                        {expandedId === event.id && (
                            <div style={{ 
                                marginTop: "10px", padding: "20px", backgroundColor: "#f9f9f9", 
                                borderRadius: "8px", fontSize: "0.95em", border: "1px solid #ddd" 
                            }}>
                                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px" }}>
                                    <strong>ID:</strong> <span>{event.id}</span>
                                    <strong>イベント名:</strong> <span>{event.name}</span>
                                    <strong>キャッチコピー:</strong> <span>{event.catchphrase || "未設定"}</span>
                                    <strong>開催期間:</strong> <span>{event.start_date} ～ {event.end_date}</span>
                                    <strong>場所:</strong> <span>{event.location || "未設定"}</span>
                                    <strong>主催者:</strong> <span>{event.organizer || "未設定"}</span>
                                    <strong>料金:</strong> <span>{event.price || "未設定"}</span>
                                    <strong>公式サイト:</strong> <span>{event.url ? <a href={event.url} target="_blank">{event.url}</a> : "未設定"}</span>
                                    <strong>カテゴリ:</strong> <span>{event.category || "未設定"}</span>
                                    <strong>お問合せ:</strong> <span>{event.contact_info || "未設定"}</span>
                                </div>
                                
                                <div style={{ marginTop: "10px", borderTop: "1px dotted #ccc", paddingTop: "10px" }}>
                                    <strong>詳細説明:</strong>
                                    <p style={{ whiteSpace: "pre-wrap", backgroundColor: "#fff", padding: "10px", border: "1px solid #eee", marginTop: "5px" }}>
                                        {event.description || "記載なし"}
                                    </p>
                                </div>

                                <div style={{ marginTop: "15px", textAlign: "right", borderTop: "1px solid #eee", paddingTop: "15px" }}>
                                    <button 
                                        onClick={() => navigate(`/EventEdit/${event.id}`)}
                                        style={{ padding: "6px 15px", cursor: "pointer", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", marginRight: "10px", fontWeight: "bold" }}
                                    >
                                        編集画面を開く ✏️
                                    </button>
                                    
                                    {status === 1 ? (
                                        <button 
                                            onClick={(e) => handleUpdateStatus(e, event.id, 9)}
                                            style={{ padding: "6px 15px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                                        >
                                            非公開にする ❌
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={(e) => handleUpdateStatus(e, event.id, 1)}
                                            style={{ padding: "6px 15px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                                        >
                                            再公開する 🔓
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

// --- メインコンポーネント ---
export default function EventManagement({ onStatusUpdate }) {
    const [eventTab, setEventTab] = useState("pending");
    
    const tabStyle = (id) => ({
        padding: '10px 20px', 
        border: 'none',
        borderBottom: eventTab === id ? '3px solid #f93d5d' : 'none',
        background: 'none', 
        cursor: 'pointer',
        fontWeight: eventTab === id ? 'bold' : 'normal',
        color: eventTab === id ? '#f93d5d' : '#666',
    });

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <h2>イベント管理</h2>

            <div style={{ marginBottom: '15px', borderBottom: '1px solid #eee', display: 'flex' }}>
                <button onClick={() => setEventTab("pending")} style={tabStyle("pending")}>未承認</button>
                <button onClick={() => setEventTab("approved")} style={tabStyle("approved")}>公開中</button>
                <button onClick={() => setEventTab("hidden")} style={tabStyle("hidden")}>非公開</button>
            </div>
            
            {eventTab === "pending" && <EventApproval onUpdate={onStatusUpdate} />}
            {eventTab === "approved" && <EventList status={1} title="公開中のイベント" />}
            {eventTab === "hidden" && <EventList status={9} title="非公開のイベント" />}
        </div>
    );
}

