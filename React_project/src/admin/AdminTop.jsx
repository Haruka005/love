import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext.js";
import UserManagement from './components/user_mg';
import EventManagement from './EventManagement.jsx';
import RestaurantManagement from './RestaurantManagement.jsx';

const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

const API_BASE = getBaseApiUrl();
const EVENT_API_URL = `${API_BASE}/admin/events`;
const SHOP_API_URL = `${API_BASE}/admin/restaurants`;

export default function AdminTop() {
    const { admin } = useAuth();
    const [activeTab, setActiveTab] = useState("users");
    const [eventCount, setEventCount] = useState(0);
    const [shopCount, setShopCount] = useState(0);

    const fetchCounts = useCallback(async () => {
        try {
            const token = localStorage.getItem("admintoken");
            const headers = { "Authorization": `Bearer ${token}`, "Accept": "application/json" };
            const [eventRes, shopRes] = await Promise.all([
                fetch(`${EVENT_API_URL}/pending`, { headers }),
                fetch(`${SHOP_API_URL}/pending`, { headers })
            ]);
            if (eventRes.ok) setEventCount((await eventRes.json()).length);
            if (shopRes.ok) setShopCount((await shopRes.json()).length);
        } catch (error) { console.error(error); }
    }, []);

    useEffect(() => { fetchCounts(); }, [fetchCounts]);

    return (
        <div style={{ padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>管理者TOPページ</h1>
            {admin && <p style={{ color: "#666", marginBottom: "20px" }}>ログイン中: {admin.name}</p>}

            <nav style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "25px 0" }}>
                {[
                    { key: "users", label: "ユーザー管理" },
                    { key: "events", label: "イベント管理", count: eventCount },
                    { key: "restaurants", label: "飲食店管理", count: shopCount },
                    { key: "site", label: "アクセス分析" },
                ].map((tab) => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                        padding: "12px 24px", borderRadius: "30px",
                        border: activeTab === tab.key ? "none" : "1px solid #ddd",
                        background: activeTab === tab.key ? "#f93d5d" : "#fff",
                        color: activeTab === tab.key ? "#fff" : "#666",
                        cursor: "pointer", fontWeight: "bold", boxShadow: activeTab === tab.key ? "0 4px 12px rgba(249,61,93,0.3)" : "none"
                    }}>
                        {tab.label} {tab.count > 0 && <span style={{ marginLeft: "8px", background: "#fff", color: "#f93d5d", padding: "1px 7px", borderRadius: "10px", fontSize: "11px" }}>{tab.count}</span>}
                    </button>
                ))}
            </nav>

            <div style={{ background: "#fff", borderRadius: "20px", padding: "30px", boxShadow: "0 2px 15px rgba(0,0,0,0.05)" }}>
                {activeTab === "users" && <UserManagement />}
                {activeTab === "events" && <EventManagement onStatusUpdate={fetchCounts} />}
                {activeTab === "restaurants" && <RestaurantManagement onStatusUpdate={fetchCounts} />}
                {activeTab === "site" && <SiteManagement />}
            </div>
        </div>
    );
}

function SiteManagement() {
    const [data, setData] = useState(null);
    const [subTab, setSubTab] = useState("hourly");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem("admintoken");
                const res = await fetch(`${API_BASE}/admin/analytics-summary`, {
                    headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
                });
                if (res.ok) setData(await res.json());
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        load();
    }, []);

    if (loading || !data) return <p style={{ textAlign: "center", padding: "100px" }}>📊 データを集計中...</p>;

    const styles = {
        kpiCard: { flex: 1, padding: "20px", background: "#fff", borderRadius: "16px", border: "1px solid #eee", textAlign: "center" },
        subTabBtn: (active) => ({
            padding: "10px 15px", cursor: "pointer", border: "none", background: "none",
            borderBottom: active ? "3px solid #f93d5d" : "3px solid transparent",
            color: active ? "#f93d5d" : "#999", fontWeight: active ? "bold" : "normal", fontSize: "14px"
        })
    };

    return (
        <div>
            {/* KPI指標 */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "35px" }}>
                <div style={styles.kpiCard}><div style={{ color: "#999", fontSize: "12px" }}>今日</div><div style={{ fontSize: "24px", fontWeight: "bold", color: "#f93d5d" }}>{data.today_pv} PV</div></div>
                <div style={styles.kpiCard}><div style={{ color: "#999", fontSize: "12px" }}>訪問者</div><div style={{ fontSize: "24px", fontWeight: "bold" }}>{data.today_uu} 人</div></div>
                <div style={styles.kpiCard}><div style={{ color: "#999", fontSize: "12px" }}>累計</div><div style={{ fontSize: "24px", fontWeight: "bold" }}>{data.total_pv} PV</div></div>
            </div>

            {/* サブタブナビゲーション */}
            <div style={{ display: "flex", borderBottom: "1px solid #eee", marginBottom: "25px", gap: "10px", overflowX: "auto" }}>
                <button onClick={() => setSubTab("hourly")} style={styles.subTabBtn(subTab === "hourly")}>時間帯別アクセス</button>
                <button onClick={() => setSubTab("latest_event")} style={styles.subTabBtn(subTab === "latest_event")}> 人気イベント</button>
                <button onClick={() => setSubTab("restaurant")} style={styles.subTabBtn(subTab === "restaurant")}>飲食店分析</button>
                <button onClick={() => setSubTab("event")} style={styles.subTabBtn(subTab === "event")}> イベント分析</button>
                <button onClick={() => setSubTab("history")} style={styles.subTabBtn(subTab === "history")}>全履歴</button>
            </div>

            {/* 1. 時間帯別詳細分析 */}
            {subTab === "hourly" && (
                <div>
                    <h4 style={{ marginBottom: "20px", color: "#333" }}>⏰ 24時間アクティビティ</h4>
                    <div style={{ 
                        display: 'flex', alignItems: 'flex-end', height: '240px', gap: '4px', 
                        padding: '40px 20px', background: 'linear-gradient(to bottom, #fff, #fafafa)', 
                        borderRadius: '15px', border: '1px solid #f0f0f0', position: 'relative'
                    }}>
                        {/* ゾーン背景 */}
                        <div style={{ position: 'absolute', left: '0', width: '25%', height: '100%', background: 'rgba(44, 62, 80, 0.02)' }}></div>
                        <div style={{ position: 'absolute', left: '25%', width: '25%', height: '100%', background: 'rgba(52, 152, 219, 0.02)' }}></div>
                        <div style={{ position: 'absolute', left: '50%', width: '25%', height: '100%', background: 'rgba(230, 126, 34, 0.02)' }}></div>
                        <div style={{ position: 'absolute', left: '75%', width: '25%', height: '100%', background: 'rgba(155, 89, 182, 0.02)' }}></div>

                        {data.hourly_stats.map((item, i) => {
                            const max = Math.max(...data.hourly_stats.map(s => s.count), 1);
                            const height = (item.count / max) * 100;
                            const isPeak = item.count === max && item.count > 0;

                            // 時間帯別カラー設定
                            let barColor = "#ccc";
                            if (item.hour >= 0 && item.hour < 6) barColor = "#5d6d7e";      // 深夜
                            else if (item.hour >= 6 && item.hour < 12) barColor = "#3498db"; // 午前
                            else if (item.hour >= 12 && item.hour < 18) barColor = "#e67e22"; // 午後
                            else barColor = "#8e44ad";                                      // 夜間

                            return (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', position: 'relative', zIndex: 1 }}>
                                    <span style={{ fontSize: '10px', color: isPeak ? '#f93d5d' : '#bbb', fontWeight: 'bold', marginBottom: '5px' }}>
                                        {item.count > 0 ? item.count : ''}
                                    </span>
                                    <div style={{ 
                                        width: '85%', height: `${height}%`, 
                                        background: isPeak ? '#f93d5d' : barColor,
                                        borderRadius: '4px 4px 1px 1px', transition: 'height 0.8s ease',
                                        boxShadow: isPeak ? '0 0 8px rgba(249,61,93,0.3)' : 'none'
                                    }}></div>
                                    <span style={{ fontSize: '9px', marginTop: '10px', color: i % 4 === 0 ? '#333' : '#bbb', fontWeight: i % 4 === 0 ? 'bold' : 'normal' }}>
                                        {item.hour}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* 色の説明（凡例） */}
                    <div style={{ 
                        display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px', 
                        marginTop: '15px', fontSize: '12px', color: '#666' 
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ width: '12px', height: '12px', background: '#5d6d7e', borderRadius: '2px' }}></span> 深夜(0-6)
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ width: '12px', height: '12px', background: '#3498db', borderRadius: '2px' }}></span> 午前(6-12)
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ width: '12px', height: '12px', background: '#e67e22', borderRadius: '2px' }}></span> 午後(12-18)
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ width: '12px', height: '12px', background: '#8e44ad', borderRadius: '2px' }}></span> 夜間(18-24)
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ width: '12px', height: '12px', background: '#f93d5d', borderRadius: '2px' }}></span> ピーク
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', padding: '15px', borderRadius: '12px', background: '#fff9fa', border: '1px solid #ffebee', color: '#d32f2f' }}>
                        <strong>💡 分析ヒント:</strong> 今日は <strong>{data.hourly_stats.reduce((a, b) => a.count > b.count ? a : b).hour}時台</strong> に最も人が集まっています。
                    </div>
                </div>
            )}

            {/* 2. 直近イベントの注目度分析 */}
            {subTab === "latest_event" && (
                <div>
                    <h4 style={{ marginBottom: "20px", color: "#333" }}>🤩 直近イベントの人気度 🤩</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                        {data.latest_events?.map((ev, i) => (
                            <div key={i} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '16px', background: '#fff', position: 'relative', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                                <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#f93d5d', color: '#fff', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                                     {ev.pv_count} PV
                                </div>
                                <div style={{ fontSize: '11px', color: '#f93d5d', fontWeight: 'bold', marginBottom: '8px' }}>ランキング {i + 1}位</div>
                                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333', marginBottom: '10px', paddingRight: '60px' }}>{ev.name}</div>
                                <div style={{ fontSize: '13px', color: '#777' }}>📅 {ev.event_date}</div>
                                <div style={{ fontSize: '13px', color: '#777' }}>📍 {ev.location}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. 飲食店ランキング */}
            {subTab === "restaurant" && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ textAlign: "left", color: "#999", borderBottom: "1px solid #eee" }}><th style={{ padding: "15px" }}>店舗名</th><th>エリア</th><th>閲覧数</th></tr></thead>
                    <tbody>
                        {data.restaurants?.map((r, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #f9f9f9" }}>
                                <td style={{ padding: "15px", fontWeight: "bold" }}>{r.name}</td>
                                <td>{r.area}</td>
                                <td style={{ color: "#f93d5d", fontWeight: "bold" }}>{r.count} PV</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* 4. イベントランキング */}
            {subTab === "event" && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ textAlign: "left", color: "#999", borderBottom: "1px solid #eee" }}><th style={{ padding: "15px" }}>イベント名</th><th>場所</th><th>閲覧数</th></tr></thead>
                    <tbody>
                        {data.events?.map((e, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #f9f9f9" }}>
                                <td style={{ padding: "15px", fontWeight: "bold" }}>{e.name}</td>
                                <td>{e.location}</td>
                                <td style={{ color: "#f93d5d", fontWeight: "bold" }}>{e.count} PV</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* 5. リアルタイム履歴 */}
            {subTab === "history" && (
                <div style={{ maxHeight: "450px", overflowY: "auto", border: "1px solid #f0f0f0", borderRadius: "10px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                        <thead style={{ position: "sticky", top: 0, background: "#fafafa", zIndex: 1 }}>
                            <tr style={{ textAlign: "left", color: "#999" }}><th style={{ padding: "12px" }}>時刻</th><th>ユーザー</th><th>アクセスURL</th></tr>
                        </thead>
                        <tbody>
                            {data.recent_logs?.map((log, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={{ padding: "12px", whiteSpace: "nowrap" }}>{new Date(log.accessed_at).toLocaleString('ja-JP', {hour:'2-digit', minute:'2-digit', second:'2-digit'})}</td>
                                    <td>{log.user_name || <span style={{color: '#ccc'}}>ゲスト</span>}</td>
                                    <td style={{ color: "#0066cc" }}>{log.url.split('/').slice(-2).join('/')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}