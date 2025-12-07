// AdminTop.js

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import UserManagement from './components/user_mg';
import EventApproval from './EventApproval';

const API_URL = "http://localhost:8000/api/admin/events"; 

const badgeStyle = {
    marginLeft: '8px',
    padding: '2px 8px',
    backgroundColor: '#f44336',
    color: 'white',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: 'normal',
};

export default function AdminTop() {
    const [activeTab, setActiveTab] = useState("users");
    const [pendingCount, setPendingCount] = useState(0);

    const fetchPendingCount = async () => {
        try {
            const token = localStorage.getItem("token"); // ← トークン取得
            const response = await fetch(`${API_URL}/pending`, {
                headers: {
                    "Authorization": `Bearer ${token}`, // ← Bearerトークン送信
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setPendingCount(data.length); 
            } else {
                console.error("承認待ち件数の取得に失敗しました。");
            }
        } catch (error) {
            console.error("通信エラー:", error);
        }
    };

    useEffect(() => {
        fetchPendingCount();
    }, []);

    return (
        <div>
            <h1>管理者ページ</h1>

            {/* タブ切り替えメニュー */}
            <nav
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    margin: "20px 0",
                }}
            >
                {[
                    { key: "users", label: "ユーザー管理" },
                    { key: "events", label: "イベント管理" },
                    { key: "restaurants", label: "飲食店管理" },
                    { key: "site", label: "サイト管理" },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            padding: "10px 15px",
                            borderRadius: "25px",
                            border: activeTab === tab.key ? "2px solid #f93d5d" : "1px solid #ccc",
                            background: activeTab === tab.key ? "#ffe6ec" : "#fff",
                            cursor: "pointer",
                            position: "relative",
                        }}
                    >
                        {tab.label}
                        
                        {/* イベント管理タブにのみバッジを表示 */}
                        {tab.key === 'events' && pendingCount > 0 && (
                            <span style={badgeStyle}>
                                {pendingCount}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            {/* コンテンツ切り替え */}
            <div style={{ background: "#fff", borderRadius: "15px", padding: "20px" }}>
                {activeTab === "users" && <UserManagement />}
                {activeTab === "events" && <EventManagement onStatusUpdate={fetchPendingCount} />} 
                {activeTab === "restaurants" && <RestaurantManagement />}
                {activeTab === "site" && <SiteManagement />}
            </div>
        </div>
    );
}

// --- コンポーネント定義 ---

/* イベント管理 */
function EventManagement({ onStatusUpdate }) {
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

/* 承認済みイベント一覧コンポーネント */
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

        for (let y = currentYear; y >= currentYear - 1; y--) {
            const startMonth = (y === currentYear) ? currentMonth : 12;
            for (let m = startMonth; m >= 1; m--) {
                const monthString = String(m).padStart(2, '0');
                const value = `${y}-${monthString}`;
                options.push({
                    value: value,
                    label: `${y}年${m}月`
                });
                if (y < currentYear && m === 1) break;
            }
        }
        return options;
    };
    
    const yearMonthOptions = generateYearMonthOptions();

    const fetchApprovedEvents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token"); // ← トークン取得
            const url = `${API_URL}/approved?year_month=${selectedYearMonth}`;
            
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${token}`, // ← Bearerトークン送信
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

/* 飲食店管理 */
function RestaurantManagement() {
    return (
        <div>
            <h2>飲食店管理</h2>
            <p>お店情報の登録・編集・削除が行えます。</p>
            <button>＋ 店舗を追加</button>
        </div>
    );
}

/* サイト管理 */
function SiteManagement() {
    return (
        <div>
            <h2>サイト管理</h2>
            <label>
                トップページメッセージ：
                <input
                    type="text"
                    placeholder="例：登別の魅力を発信中！"
                    style={{ width: "80%", marginLeft: "10px" }}
                />
            </label>
            <br /><br />
            <button>💾 保存</button>
        </div>
    );
}