import React, { useState, useEffect, useCallback } from "react"; // useCallbackを追加
import { useNavigate } from 'react-router-dom';
import UserManagement from './components/user_mg';
import EventManagement from './EventManagement.jsx';
import RestaurantManagement from './RestaurantManagement.jsx'; 

// APIエンドポイントの設定
const EVENT_API_URL = `${process.env.REACT_APP_API_URL}/api/admin/events`;  
const SHOP_API_URL = `${process.env.REACT_APP_API_URL}/api/admin/restaurants`; 

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
    const [eventCount, setEventCount] = useState(0);
    const [shopCount, setShopCount] = useState(0);

    // useCallbackで囲むことで、再レンダリングのたびに関数が作り直されるのを防ぎ、無限ループを止めます
    const fetchCounts = useCallback(async () => {
        try {
            const token = localStorage.getItem("token"); 
            const headers = {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
            };

            // イベントと飲食店の件数を同時に取得
            const [eventRes, shopRes] = await Promise.all([
                fetch(`${EVENT_API_URL}/pending`, { headers }),
                fetch(`${SHOP_API_URL}/pending`, { headers })
            ]);

            if (eventRes.ok) {
                const eventData = await eventRes.json();
                setEventCount(eventData.length);
            }
            if (shopRes.ok) {
                const shopData = await shopRes.json();
                setShopCount(shopData.length);
            }
        } catch (error) {
            console.error("承認待ち件数の取得エラー:", error);
        }
    }, []); // 依存配列は空

    useEffect(() => {
        fetchCounts();
    }, [fetchCounts]); // fetchCountsを監視

    return (
        <div style={{ padding: "20px" }}>
            <h1>管理者ページ</h1>

            {/* タブメニュー */}
            <nav style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "20px 0" }}>
                {[
                    { key: "users", label: "ユーザー管理" },
                    { key: "events", label: "イベント管理", count: eventCount },
                    { key: "restaurants", label: "飲食店管理", count: shopCount },
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
                        {tab.count > 0 && <span style={badgeStyle}>{tab.count}</span>}
                    </button>
                ))}
            </nav>

            {/* 各コンテンツの表示エリア */}
            <div style={{ background: "#fff", borderRadius: "15px", padding: "20px", border: "1px solid #eee" }}>
                
                {activeTab === "users" && <UserManagement />}
                
                {activeTab === "events" && (
                    <EventManagement onStatusUpdate={fetchCounts} />
                )} 

                {activeTab === "restaurants" && (
                    <RestaurantManagement onStatusUpdate={fetchCounts} />
                )}
                {activeTab === "site" && <SiteManagement />}
            </div>
        </div>
    );
}

/* サイト管理用サブコンポーネント */
function SiteManagement() {
    return (
        <div>
            <h2>サイト管理</h2>
            <label>
                トップページメッセージ：
                <input
                    type="text"
                    placeholder="例：登別の魅力を発信中！"
                    style={{ width: "80%", marginLeft: "10px", padding: "5px" }}
                />
            </label>
            <br /><br />
            <button style={{ padding: "10px 20px", cursor: "pointer" }}>💾 保存</button>
        </div>
    );
}