// AdminTop.js (最終修正版)

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import UserManagement from './components/user_mg';
import EventManagement from './EventManagement.jsx'; // 新しく分割したファイルをインポート

const API_URL = "/api/admin/events"; 

const badgeStyle = {
    marginLeft: '8px',
    padding: '2px 8px',
    backgroundColor: '#f44336',
    color: 'white',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: 'normal',
};

// --- AdminTop (メインコンポーネント) ---
export default function AdminTop() {
    const [activeTab, setActiveTab] = useState("users");
    const [pendingCount, setPendingCount] = useState(0);

    const fetchPendingCount = async () => {
        try {
            const token = localStorage.getItem("token"); 
            const response = await fetch(`${API_URL}/pending`, {
                headers: {
                    "Authorization": `Bearer ${token}`, 
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

// --- AdminTop.js に残す最小限のコンポーネント定義 ---

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