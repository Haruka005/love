// 管理者トップ画面
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext.js";

// 各管理コンポーネントのインポート
// エラーに基づき、パスを ../components/ 配下に修正しました
import UserManagement from '../components/UserManagement';
import EventManagement from '../components/EventManagement'; 
import RestaurantManagement from '../components/RestaurantManagement.jsx'; // 同ディレクトリ(pages)にある場合はこのまま
import SiteManagement from '../components/AdminSiteManagement';
import AdminRegistration from '../components/AdminRegistration';

/**
 * APIの基本URLを取得するユーティリティ
 */
const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

const API_BASE = getBaseApiUrl();
const EVENT_API_URL = `${API_BASE}/admin/events`;
const SHOP_API_URL = `${API_BASE}/admin/restaurants`;

export default function AdminTop() {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("users");
    const [eventCount, setEventCount] = useState(0);
    const [shopCount, setShopCount] = useState(0);

    // --- ログアウト用のステート ---
    const [showConfirm, setShowConfirm] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

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

            if (eventRes.ok) {
                const eventData = await eventRes.json();
                setEventCount(eventData.length);
            }
            if (shopRes.ok) {
                const shopData = await shopRes.json();
                setShopCount(shopData.length);
            }
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

    // --- ログアウト実行関数 ---
    const handleLogoutConfirm = async () => {
        setLoggingOut(true);
        setShowConfirm(false);
        const token = localStorage.getItem("admintoken");

        try {
            await fetch(`${API_BASE}/admin/logout`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
        } catch (err) {
            console.error("サーバーログアウト通信エラー", err);
        }

        // ローカルのクリーンアップ
        localStorage.removeItem("admintoken");
        if (logout) logout(); 
        
        setTimeout(() => {
            navigate("/AdminLogin");
        }, 500);
    };

    if (!admin && !localStorage.getItem("admintoken")) {
        return null;
    }

    // --- インラインスタイルの定義 ---
    const modalOverlayStyle = {
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center",
        alignItems: "center", zIndex: 3000
    };

    const modalBoxStyle = {
        backgroundColor: "#fff", padding: "30px", borderRadius: "15px", textAlign: "center",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)", minWidth: "300px"
    };

    return (
        <div style={{ padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>管理者TOPページ</h1>
            
            {/* ログイン情報とログアウトボタンの横並び配置 */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                {admin && (
                    <p style={{ color: "#666", margin: 0 }}>
                        ログイン中: <strong>{admin.name}</strong>
                    </p>
                )}
                <button 
                    onClick={() => setShowConfirm(true)}
                    style={{
                        padding: "5px 15px",
                        fontSize: "12px",
                        borderRadius: "20px",
                        border: "1px solid #f93d5d",
                        backgroundColor: "#fff",
                        color: "#f93d5d",
                        cursor: "pointer",
                        fontWeight: "bold",
                        transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = "#f93d5d"; e.target.style.color = "#fff"; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = "#fff"; e.target.style.color = "#f93d5d"; }}
                >
                    ログアウト
                </button>
            </div>

            {/* 確認モーダル */}
            {showConfirm && (
                <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                        <p style={{ fontWeight: "bold", marginBottom: "20px" }}>本当にログアウトしますか？</p>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                            <button 
                                onClick={handleLogoutConfirm} 
                                style={{ padding: "10px 25px", backgroundColor: "#f93d5d", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
                            >
                                はい
                            </button>
                            <button 
                                onClick={() => setShowConfirm(false)} 
                                style={{ padding: "10px 25px", backgroundColor: "#eee", color: "#333", border: "none", borderRadius: "8px", cursor: "pointer" }}
                            >
                                いいえ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 処理中オーバーレイ */}
            {loggingOut && (
                <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                        <p>ログアウト処理中...</p>
                    </div>
                </div>
            )}

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