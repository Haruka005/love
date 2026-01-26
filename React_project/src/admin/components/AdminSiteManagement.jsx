//管理者アクセス解析
import React, { useState, useEffect } from "react";

const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://172.16.117.200:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};
const API_BASE = getBaseApiUrl();

export default function SiteManagement() {
    const [data, setData] = useState(null);
    const [subTab, setSubTab] = useState("hourly");
    const [loading, setLoading] = useState(true);

    // デバイス解析（OSとブラウザのみ）
    const parseUA = (ua) => {
        if (!ua) return { os: "不明", browser: "不明" };
        let os = "PC";
        if (ua.includes("iPhone")) os = "iPhone";
        else if (ua.includes("Android")) os = "Android";
        else if (ua.includes("iPad")) os = "iPad";
        else if (ua.includes("Macintosh")) os = "Mac";

        let browser = "Other";
        if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Edg")) browser = "Edge";
        else if (ua.includes("Chrome")) browser = "Chrome";
        else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        
        return { os, browser };
    };

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
                if (res.ok) setData(await res.json());
            } catch (error) {
                console.error("Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading || !data) return <p style={{ textAlign: "center", padding: "100px" }}>データを読み込み中...</p>;

    const styles = {
        kpiCard: { flex: 1, padding: "20px", background: "#fff", borderRadius: "16px", border: "1px solid #eee", textAlign: "center" },
        subTabBtn: (active) => ({
            padding: "10px 15px", cursor: "pointer", border: "none", background: "none",
            borderBottom: active ? "3px solid #f93d5d" : "3px solid transparent",
            color: active ? "#f93d5d" : "#999", fontWeight: active ? "bold" : "normal", fontSize: "14px"
        }),
        td: { padding: "12px 8px", borderBottom: "1px solid #f0f0f0" },
        tag: { fontSize: "11px", background: "#f0f0f0", padding: "2px 6px", borderRadius: "4px", color: "#666" }
    };

    return (
        <div>
            {/* KPIサマリー */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "35px" }}>
                <div style={styles.kpiCard}><div style={{ color: "#999", fontSize: "12px" }}>今日</div><div style={{ fontSize: "24px", fontWeight: "bold", color: "#f93d5d" }}>{data.today_pv} PV</div></div>
                <div style={styles.kpiCard}><div style={{ color: "#999", fontSize: "12px" }}>訪問者</div><div style={{ fontSize: "24px", fontWeight: "bold" }}>{data.today_uu} 人</div></div>
                <div style={styles.kpiCard}><div style={{ color: "#999", fontSize: "12px" }}>累計</div><div style={{ fontSize: "24px", fontWeight: "bold" }}>{data.total_pv} PV</div></div>
            </div>

            {/* タブメニュー */}
            <div style={{ display: "flex", borderBottom: "1px solid #eee", marginBottom: "25px", gap: "10px", overflowX: "auto" }}>
                <button onClick={() => setSubTab("hourly")} style={styles.subTabBtn(subTab === "hourly")}>時間帯別アクセス</button>
                <button onClick={() => setSubTab("restaurant")} style={styles.subTabBtn(subTab === "restaurant")}>飲食店分析</button>
                <button onClick={() => setSubTab("event")} style={styles.subTabBtn(subTab === "event")}>イベント分析</button>
                <button onClick={() => setSubTab("history")} style={styles.subTabBtn(subTab === "history")}>リアルタイム解析</button>
            </div>

            {/* コンテンツ表示 */}
            {subTab === "hourly" && (
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '240px', gap: '4px', padding: '40px 20px', background: '#fafafa', borderRadius: '15px', border: '1px solid #f0f0f0' }}>
                    {data.hourly_stats.map((item, i) => {
                        const max = Math.max(...data.hourly_stats.map(s => s.count), 1);
                        const height = (item.count / max) * 100;
                        return <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                            <div style={{ width: '85%', height: `${height}%`, background: item.count === max ? '#f93d5d' : '#3498db', borderRadius: '4px' }}></div>
                            <span style={{ fontSize: '9px' }}>{item.hour}</span>
                        </div>
                    })}
                </div>
            )}

            {subTab === "restaurant" && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                        {data.restaurants?.map((r, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #f9f9f9" }}>
                                <td style={{ padding: "15px", fontWeight: "bold" }}>{r.name}</td>
                                <td style={{ color: "#f93d5d", fontWeight: "bold", textAlign: "right" }}>{r.count} PV</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {subTab === "event" && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                        {data.events?.map((e, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #f9f9f9" }}>
                                <td style={{ padding: "15px", fontWeight: "bold" }}>{e.name}</td>
                                <td style={{ color: "#f93d5d", fontWeight: "bold", textAlign: "right" }}>{e.count} PV</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {subTab === "history" && (
                <div style={{ maxHeight: "500px", overflowY: "auto", border: "1px solid #eee", borderRadius: "8px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                        <thead style={{ position: "sticky", top: 0, background: "#f8f9fa" }}>
                            <tr style={{ textAlign: "left" }}>
                                <th style={{ padding: "12px 8px" }}>時刻</th>
                                <th>ユーザー名</th>
                                <th>アクセスURL</th>
                                <th>環境</th>
                                <th>IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recent_logs?.map((log, i) => {
                                const { os, browser } = parseUA(log.user_agent);
                                return (
                                    <tr key={i}>
                                        <td style={styles.td}>{new Date(log.accessed_at).toLocaleTimeString('ja-JP')}</td>
                                        <td style={{ ...styles.td, fontWeight: "bold" }}>{log.user_name || "ゲスト"}</td>
                                        <td style={{ ...styles.td, color: "#0066cc", fontSize: "12px", wordBreak: "break-all" }}>{log.url}</td>
                                        <td style={styles.td}>
                                            <span style={styles.tag}>{os} / {browser}</span>
                                        </td>
                                        <td style={{ ...styles.td, color: "#999", fontSize: "11px" }}>{log.ip_address}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

