// EventManagement.js

import React, { useState, useEffect } from "react";
import EventApproval from './EventApproval.jsx'; // EventApprovalコンポーネントをインポート

// EventApproval.js と同じAPI_URLを使用
const API_URL = "http://localhost:8000/api/admin/events"; 

// --- 承認済みイベント一覧コンポーネント ---

function ApprovedEventList() {
    const [approvedEvents, setApprovedEvents] = useState([]);
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
                    <div key={event.id} style={{ borderBottom: '1px dotted #ccc', padding: '10px 0' }}>
                        <strong>{event.name}</strong> ({event.start_date}~)
                        <span style={{ float: 'right' }}>[詳細・編集]</span>
                    </div>
                ))
            }
        </div>
    );
}


// --- イベント管理メインコンポーネント (export default) ---

export default function EventManagement({ onStatusUpdate }) {
    const [eventTab, setEventTab] = useState("pending");
    
    return (
        <div>
            <h2>イベント管理</h2>

            {/* イベント管理内部のタブ切り替えメニュー */}
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
            
            {/* コンテンツ切り替え */}
            {eventTab === "pending" && (
                <EventApproval onUpdate={onStatusUpdate} />
            )}
            
            {eventTab === "approved" && (
                <ApprovedEventList />
            )}
        </div>
    );
}