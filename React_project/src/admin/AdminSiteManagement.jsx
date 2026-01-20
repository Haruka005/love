//管理者アクセス解析

import React, { useState, useEffect } from "react";

// APIの基本URLを取得するユーティリティ
const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};
const API_BASE = getBaseApiUrl();

export default function SiteManagement() {
    const [data, setData] = useState(null);
    const [subTab, setSubTab] = useState("hourly");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const token = localStorage.getItem("admintoken");
            if (!token) return;

            try {
                const res = await fetch(`${API_BASE}/admin/analytics-summary`, {
                    headers: { 
                        "Authorization": `Bearer ${token}`, 
                        "Accept": "application/json" 
                    }
                });
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (error) { 
                console.error("分析データの取得失敗:", error); 
            } finally { 
                setLoading(false); 
            }
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
            <div style={{ display: "flex", gap: "15px", marginBottom: "35px" }}>
                <div style={styles.kpiCard}><div style={{ color: "#999", fontSize: "12px" }}>今日</div><div style={{ fontSize: "24px", fontWeight: "bold", color: "#f93d5d" }}>{data.today_pv} PV</div></div>
                <div style={styles.kpiCard}><div style={{ color: "#999", fontSize: "12px" }}>訪問者</div><div style={{ fontSize: "24px", fontWeight: "bold" }}>{data.today_uu} 人</div></div>
                <div style={styles.kpiCard}><div style={{ color: "#999", fontSize: "12px" }}>累計</div><div style={{ fontSize: "24px", fontWeight: "bold" }}>{data.total_pv} PV</div></div>
            </div>

            <div style={{ display: "flex", borderBottom: "1px solid #eee", marginBottom: "25px", gap: "10px", overflowX: "auto" }}>
                <button onClick={() => setSubTab("hourly")} style={styles.subTabBtn(subTab === "hourly")}>時間帯別アクセス</button>
                <button onClick={() => setSubTab("latest_event")} style={styles.subTabBtn(subTab === "latest_event")}> 人気イベント</button>
                <button onClick={() => setSubTab("restaurant")} style={styles.subTabBtn(subTab === "restaurant")}>飲食店分析</button>
                <button onClick={() => setSubTab("event")} style={styles.subTabBtn(subTab === "event")}> イベント分析</button>
                <button onClick={() => setSubTab("history")} style={styles.subTabBtn(subTab === "history")}>全履歴</button>
            </div>

            {subTab === "hourly" && (
                <div>
                    <h4 style={{ marginBottom: "20px", color: "#333" }}>⏰ 24時間アクティビティ</h4>
                    <div style={{ 
                        display: 'flex', alignItems: 'flex-end', height: '240px', gap: '4px', 
                        padding: '40px 20px', background: 'linear-gradient(to bottom, #fff, #fafafa)', 
                        borderRadius: '15px', border: '1px solid #f0f0f0', position: 'relative'
                    }}>
                        {data.hourly_stats.map((item, i) => {
                            const max = Math.max(...data.hourly_stats.map(s => s.count), 1);
                            const height = (item.count / max) * 100;
                            const isPeak = item.count === max && item.count > 0;
                            let barColor = item.hour < 6 ? "#5d6d7e" : item.hour < 12 ? "#3498db" : item.hour < 18 ? "#e67e22" : "#8e44ad";
                            return (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', zIndex: 1 }}>
                                    <span style={{ fontSize: '10px', color: isPeak ? '#f93d5d' : '#bbb', fontWeight: 'bold' }}>{item.count > 0 ? item.count : ''}</span>
                                    <div style={{ width: '85%', height: `${height}%`, background: isPeak ? '#f93d5d' : barColor, borderRadius: '4px 4px 1px 1px' }}></div>
                                    <span style={{ fontSize: '9px', marginTop: '10px' }}>{item.hour}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {subTab === "latest_event" && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                    {data.latest_events?.map((ev, i) => (
                        <div key={i} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '16px', background: '#fff' }}>
                            <div style={{ fontSize: '11px', color: '#f93d5d', fontWeight: 'bold' }}>Rank {i + 1}</div>
                            <div style={{ fontWeight: 'bold', fontSize: '14px', margin: '5px 0' }}>{ev.name}</div>
                            <div style={{ color: "#f93d5d", fontSize: "18px", fontWeight: "bold" }}>{ev.pv_count} PV</div>
                        </div>
                    ))}
                </div>
            )}

            {subTab === "restaurant" && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ textAlign: "left", color: "#999", borderBottom: "1px solid #eee" }}>
                            <th style={{ padding: "15px" }}>店舗名</th><th>閲覧数</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.restaurants?.map((r, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #f9f9f9" }}>
                                <td style={{ padding: "15px", fontWeight: "bold" }}>{r.name}</td>
                                <td style={{ color: "#f93d5d", fontWeight: "bold" }}>{r.count} PV</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {subTab === "event" && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ textAlign: "left", color: "#999", borderBottom: "1px solid #eee" }}>
                            <th style={{ padding: "15px" }}>イベント名</th><th>閲覧数</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.events?.map((e, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #f9f9f9" }}>
                                <td style={{ padding: "15px", fontWeight: "bold" }}>{e.name}</td>
                                <td style={{ color: "#f93d5d", fontWeight: "bold" }}>{e.count} PV</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {subTab === "history" && (
                <div style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #eee", borderRadius: "10px" }}>
                    <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                        <thead style={{ position: "sticky", top: 0, background: "#f8f9fa" }}>
                            <tr style={{ textAlign: "left", color: "#999" }}>
                                <th style={{ padding: "12px" }}>時刻</th><th>ユーザー</th><th>アクセスURL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recent_logs?.map((log, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={{ padding: "10px" }}>{new Date(log.accessed_at).toLocaleTimeString()}</td>
                                    <td>{log.user_name || "ゲスト"}</td>
                                    <td style={{ color: "#0066cc" }}>{log.url}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

