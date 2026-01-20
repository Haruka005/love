import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext.js";

// 各管理コンポーネントのインポート
import UserManagement from './components/user_mg';
import EventManagement from './EventManagement.jsx';
import RestaurantManagement from './RestaurantManagement.jsx';
import SiteManagement from './AdminSiteManagement';
import AdminRegistration from './AdminRegistration';

// APIの基本URLを取得するユーティリティ
const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

const API_BASE = getBaseApiUrl();
const EVENT_API_URL = `${API_BASE}/admin/events`;
const SHOP_API_URL = `${API_BASE}/admin/restaurants`;

export default function AdminTop() {
    const { admin } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("users");
    const [eventCount, setEventCount] = useState(0);
    const [shopCount, setShopCount] = useState(0);

    // 1. ログインチェック
    useEffect(() => {
        const token = localStorage.getItem("admintoken");
        if (!admin && !token) {
            navigate("/AdminLogin");
        }
    }, [admin, navigate]);

    // 2. 承認待ち件数の取得処理
    const fetchCounts = useCallback(async () => {
        const token = localStorage.getItem("admintoken");
        if (!token) return;

        try {
            const headers = { 
                "Authorization": `Bearer ${token}`, 
                "Accept": "application/json" 
            };
            
            const [eventRes, shopRes] = await Promise.all([
                fetch(`${EVENT_API_URL}/pending`, { headers }),
                fetch(`${SHOP_API_URL}/pending`, { headers })
            ]);

            if (eventRes.status === 401 || shopRes.status === 401) {
                localStorage.removeItem("admintoken");
                navigate("/AdminLogin");
                return;
            }

            if (eventRes.ok) setEventCount((await eventRes.json()).length);
            if (shopRes.ok) setShopCount((await shopRes.json()).length);
        } catch (error) { 
            console.error("承認待ち件数の取得に失敗しました:", error); 
        }
    }, [navigate]);

    // 3. 画面表示時の件数取得
    useEffect(() => { 
        if (admin || localStorage.getItem("admintoken")) {
            fetchCounts(); 
        }
    }, [fetchCounts, admin]);

    if (!admin && !localStorage.getItem("admintoken")) {
        return null;
    }

    return (
        <div style={{ padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>管理者TOPページ</h1>
            {admin && <p style={{ color: "#666", marginBottom: "20px" }}>ログイン中: {admin.name}</p>}

            {/* メインタブナビゲーション */}
            <nav style={{ 
                display: "flex", 
                justifyContent: "center", 
                gap: "8px", 
                margin: "25px 0",
                width: "100%",
                maxWidth: "1000px", 
                marginLeft: "auto",
                marginRight: "auto",
                overflowX: "auto",
                paddingBottom: "5px"
            }}>
                {[
                    { key: "users", label: "ユーザー管理" },
                    { key: "events", label: "イベント管理", count: eventCount },
                    { key: "restaurants", label: "飲食店管理", count: shopCount },
                    { key: "site", label: "アクセス分析" },
                    { key: "admin_reg", label: "管理者登録" },
                ].map((tab) => (
                    <button 
                        key={tab.key} 
                        onClick={() => setActiveTab(tab.key)} 
                        style={{
                            flex: 1,
                            minWidth: "120px",
                            whiteSpace: "nowrap",
                            padding: "12px 5px",
                            borderRadius: "30px",
                            fontSize: "14px",
                            border: activeTab === tab.key ? "none" : "1px solid #ddd",
                            background: activeTab === tab.key ? "#f93d5d" : "#fff",
                            color: activeTab === tab.key ? "#fff" : "#666",
                            cursor: "pointer", 
                            fontWeight: "bold", 
                            boxShadow: activeTab === tab.key ? "0 4px 12px rgba(249,61,93,0.3)" : "none",
                            transition: "all 0.2s ease"
                        }}
                    >
                        {tab.label} 
                        {tab.count > 0 && (
                            <span style={{ 
                                marginLeft: "5px", background: "#fff", color: "#f93d5d", 
                                padding: "1px 6px", borderRadius: "10px", fontSize: "10px" 
                            }}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            {/* コンテンツ表示エリア */}
            <div style={{ background: "#fff", borderRadius: "20px", padding: "30px", boxShadow: "0 2px 15px rgba(0,0,0,0.05)" }}>
                {activeTab === "users" && <UserManagement />}
                {activeTab === "events" && <EventManagement onStatusUpdate={fetchCounts} />}
                {activeTab === "restaurants" && <RestaurantManagement onStatusUpdate={fetchCounts} />}
                {activeTab === "site" && <SiteManagement />}
                {activeTab === "admin_reg" && <AdminRegistration />}
            </div>
        </div>
    );
}