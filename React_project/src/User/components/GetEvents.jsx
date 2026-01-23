import React, { useState, useEffect, useCallback } from "react";
import EventCard from "./EventCard";
import { DateTime } from "./dateFormatter.js"; 
import Pagenation from "./Pagenation";

//イベント情報取得反映
// APIのベースURLを調整
const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

const getServerRootUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    return envUrl.endsWith("/api") ? envUrl.replace(/\/api$/, "") : envUrl;
};

const API_BASE = getBaseApiUrl();
const SERVER_ROOT = getServerRootUrl();

// 修正：引数に onRecordClick を追加
function GetEvents({ onRecordClick }) {
    const now = new Date();
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const yearOptions = [
        { value: 2025, label: "2025" },
        { value: 2026, label: "2026" },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const indexOfLastEvent = currentPage * itemsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
    const currentEvents = Array.isArray(events) ? events.slice(indexOfFirstEvent, indexOfLastEvent) : [];
    const totalPages = Math.ceil((Array.isArray(events) ? events.length : 0) / itemsPerPage);

    // --- ページ切り替え時にリストの先頭へスクロールさせる処理 ---
    const handlePageChange = (page) => {
        setCurrentPage(page);
        setTimeout(() => {
            const element = document.getElementById("event-list");
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }, 10);
    };

    // --- 詳細から戻った時のスクロール処理 ---
    useEffect(() => {
        if (window.location.hash === "#event-list") {
            const timer = setTimeout(() => {
                const element = document.getElementById("event-list");
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, []);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const monthStr = String(selectedMonth).padStart(2, "0");
            const res = await fetch(`${API_BASE}/events/${selectedYear}/${monthStr}`, {
                headers: { "Accept": "application/json" }
            });

            if (!res.ok) {
                if (res.status === 404) {
                    setEvents([]);
                    return;
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            const eventsData = Array.isArray(data) ? data : (data.events || []);
            setEvents(eventsData);
            setCurrentPage(1); 
        } catch (err) {
            console.error("イベント取得エラー:", err);
            setError("イベント情報の取得に失敗しました。");
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [selectedYear, selectedMonth]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return (
        <section 
            id="event-list"
            style={{ 
                marginTop: "0px",  
                padding: "40px 0 50px", 
                marginBottom: "0px",
                textAlign: "center", 
                backgroundImage: `url("/images/akaoni_background.png")`,
                backgroundSize: "auto",      
                backgroundRepeat: "repeat",  
                backgroundPosition: "center",
                color: "#120101ff",
                fontFamily: '"Zen Maru Gothic", sans-serif'
            }}
        >
            <div style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "15px",
                marginBottom: "30px",
                paddingBottom: "10px",
                paddingLeft: "20px",
                paddingRight: "30px",
                borderBottom: "3px dotted #f7f0f0ff",
                maxWidth: "95%"
            }}>
                <div style={{ textAlign: "left" }}>
                    <h2 style={{ 
                        margin: 0, 
                        fontSize: "2.2rem", 
                        fontWeight: "900", 
                        color: "#f51010ff",   
                        letterSpacing: "1px",
                        lineHeight: "1.1",
                        border: "none",      
                        padding: 0,
                        textShadow: `
                            -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff,
                            0 0 8px #fff,
                            0 0 15px #f51010,
                            0 0 25px rgba(245, 16, 16, 0.7)
                        `
                    }}>
                        MONTHLY EVENTS
                    </h2>
                    <span style={{ 
                        fontSize: "0.9rem", 
                        fontWeight: "700", 
                        color: "#f7f0f0ff",
                        marginLeft: "25px", 
                        display: "block",
                        marginTop: "2px"
                    }}>
                        月別イベント
                    </span>
                </div>

                <img 
                    src="/images/akaonitousin.png" 
                    alt="icon-red" 
                    style={{ 
                        width: "80px", 
                        height: "auto", 
                        marginLeft: "5px" 
                    }} 
                />
            </div>

            <div style={{ marginBottom: "25px" }}>
                <label className="selectbox">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        style={{ padding: "5px 10px", borderRadius: "25px" }}
                    >
                        {yearOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label> 
            </div>

            <div className="button-group" style={{ 
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)", 
                gap: "8px",
                maxWidth: "800px", 
                margin: "0 auto",
                padding: "0 10px"
            }}>
                {[...Array(12)].map((_, i) => {
                    const month = i + 1;
                    const isActive = selectedMonth === month;
                    return (
                        <button
                            key={month}
                            className={`tab-button ${isActive ? "active" : ""}`}
                            onClick={() => setSelectedMonth(month)}
                            style={{
                                backgroundColor: isActive ? "#f51010ff" : "#fff",
                                color: isActive ? "#fff" : "#555",
                                fontWeight: isActive ? "bold" : "normal",
                                padding: "8px 0",
                                border: `1px solid ${isActive ? "#f51010ff" : "#f93d5d"}`,
                                borderRadius: "25px",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                transition: "all 0.3s ease",
                                boxShadow: isActive ? "0 3px 8px rgba(245, 16, 16, 0.3)" : "none",
                                width: "100%"
                            }}
                        >
                            {month}月
                        </button>
                    );
                })}
            </div>

            <div style={{ padding: "0 10px", marginTop: "30px" }}>
                <h4 style={{ 
                    fontSize: "1.4rem", 
                    marginBottom: "20px", 
                    color: "#fff", 
                    fontWeight: "700"
                }}>
                    {selectedYear}年 {selectedMonth}月 のイベント
                </h4>

                {loading && <p>読み込み中です…</p>}
                {error && <p style={{ color: "yellow" }}>{error}</p>}

                {!loading && !error && events.length === 0 ? (
                    <p style={{ 
                        padding: "20px", 
                        backgroundColor: "rgba(255,255,255,0.8)", 
                        borderRadius: "8px",
                        display: "inline-block" 
                    }}>
                        現在、この月のイベント情報はありません
                    </p>
                ) : (
                    <div className="card-list">
                        {currentEvents.map((event) => {
                            const imagePath = event.image_url || event.image_path || "/images/no-image.png";
                            let fullImageUrl;
                            if (imagePath.startsWith('http')) {
                                fullImageUrl = imagePath;
                            } else {
                                const cleanRoot = SERVER_ROOT.endsWith('/') ? SERVER_ROOT.slice(0, -1) : SERVER_ROOT;
                                const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
                                fullImageUrl = `${cleanRoot}${cleanPath}`;
                            }

                            return (
                                // 修正：onClick を仕込む
                                <div key={event.id} onClick={() => onRecordClick && onRecordClick(event.id)} style={{ cursor: "pointer" }}>
                                    <EventCard
                                        id={event.id}
                                        name={event.name}
                                        catchphrase={event.catchphrase}
                                        image={fullImageUrl}
                                        start_date={DateTime(event.start_date)}
                                        end_date={DateTime(event.end_date)}
                                        location={event.location}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}            
            </div>

            {totalPages > 1 && (
                <Pagenation
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            )}
        </section>
    );
}

export default GetEvents;