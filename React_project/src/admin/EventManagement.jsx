import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 編集画面への遷移に必要
import EventApproval from './EventApproval.jsx';

// 環境変数からベースURLを取得
const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/events`; 

// --- 承認済みイベント一覧コンポーネント ---
function ApprovedEventList() {
    const [approvedEvents, setApprovedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null); // 詳細表示用のID
    const navigate = useNavigate();
    
    const today = new Date();
    const [selectedYearMonth, setSelectedYearMonth] = useState(
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
    );

    const generateYearMonthOptions = () => {
        const options = [];
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;

        for (let y = currentYear; y >= currentYear - 1; y--) {
            const startMonth = (y === currentYear) ? currentMonth : 12;
            for (let m = startMonth; m >= 1; m--) {
                const monthString = String(m).padStart(2, '0');
                const value = `${y}-${monthString}`;
                options.push({ value: value, label: `${y}年${m}月` });
                if (y < currentYear && m === 1) break;
            }
        }
        return options;
    };
    
    const yearMonthOptions = generateYearMonthOptions();

    // 承認済みイベント取得API
    const fetchApprovedEvents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token"); 
            const url = `${API_URL}/approved?year_month=${selectedYearMonth}`;
            
            const response = await fetch(url, {
                headers: { "Authorization": `Bearer ${token}` },
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

    // 削除処理
    const handleDelete = async (id) => {
        if (!window.confirm("この承認済みイベントを削除しますか？\n(サイト上の表示からも消去されます)")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (res.ok) {
                setApprovedEvents(approvedEvents.filter((e) => e.id !== id));
                alert("削除しました");
            } else {
                alert("削除に失敗しました");
            }
        } catch (err) {
            console.error("通信エラー:", err);
            alert("通信エラーが発生しました");
        }
    };

    useEffect(() => {
        fetchApprovedEvents();
    }, [selectedYearMonth]);
    
    const handleYearMonthChange = (e) => {
        setSelectedYearMonth(e.target.value);
    };

    if (loading) return <p>承認済みイベントを読み込み中...</p>;

    return (
        <div>
            <h4>承認済みイベント ({approvedEvents.length} 件)</h4>
            
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
            
            {approvedEvents.length === 0 
                ? <p style={{ color: "gray" }}>選択された年月には承認済みのイベントはありません。</p>
                : approvedEvents.map(event => (
                    <div key={event.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                        {/* タイトル部分：クリックで詳細を表示 */}
                        <div 
                            onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <span>
                                <strong>{event.name}</strong> 
                                <span style={{ fontSize: '0.85em', color: '#666', marginLeft: '10px' }}>({event.start_date}~)</span>
                            </span>
                            <span style={{ color: '#007bff', fontSize: '0.9em' }}>
                                {expandedId === event.id ? "▲ 閉じる" : "▼ 詳細・編集"}
                            </span>
                        </div>

                        {/* 詳細情報とアクションボタン */}
                        {expandedId === event.id && (
                            <div style={{ marginTop: "10px", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
                                <p><strong>場所:</strong> {event.location || "未設定"}</p>
                                <p><strong>主催者:</strong> {event.organizer || "未設定"}</p>
                                <p><strong>説明:</strong> {event.description}</p>
                                
                                {event.image_url && (
                                    <div style={{ marginTop: '10px' }}>
                                        <img src={event.image_url} alt="イベント" style={{ maxWidth: '200px', borderRadius: '4px' }} />
                                    </div>
                                )}

                                <div style={{ marginTop: "15px", textAlign: "right", borderTop: "1px solid #ddd", paddingTop: "10px" }}>
                                    <button 
                                        onClick={() => navigate(`/EventEdit/${event.id}`)}
                                        style={{ 
                                            marginRight: "10px", 
                                            padding: "6px 12px", 
                                            cursor: "pointer",
                                            backgroundColor: "#fff",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px"
                                        }}
                                    >
                                        編集 ✏️
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(event.id)}
                                        style={{ 
                                            padding: "6px 12px", 
                                            cursor: "pointer", 
                                            backgroundColor: "#dc3545", 
                                            color: "white", 
                                            border: "none", 
                                            borderRadius: "4px" 
                                        }}
                                    >
                                        削除 ❌
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            }
        </div>
    );
}

// --- イベント管理メインコンポーネント ---
export default function EventManagement({ onStatusUpdate }) {
    const [eventTab, setEventTab] = useState("pending");
    
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h2>イベント管理</h2>

            <div style={{ marginBottom: '15px', borderBottom: '1px solid #eee' }}>
                <button 
                    onClick={() => setEventTab("pending")} 
                    style={{ 
                        padding: '8px 15px',
                        border: 'none',
                        borderBottom: eventTab === 'pending' ? '2px solid #f93d5d' : 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontWeight: eventTab === 'pending' ? 'bold' : 'normal', 
                        marginRight: '10px' 
                    }}
                >
                    未承認リスト
                </button>
                <button 
                    onClick={() => setEventTab("approved")} 
                    style={{ 
                        padding: '8px 15px',
                        border: 'none',
                        borderBottom: eventTab === 'approved' ? '2px solid #f93d5d' : 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontWeight: eventTab === 'approved' ? 'bold' : 'normal' 
                    }}
                >
                    承認済みリスト
                </button>
            </div>
            
            {eventTab === "pending" && (
                <EventApproval onUpdate={onStatusUpdate} />
            )}
            
            {eventTab === "approved" && (
                <ApprovedEventList />
            )}
        </div>
    );
}