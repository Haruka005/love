import React, { useState, useEffect, useCallback } from "react";
import EventCard from "./EventCard";
// スペルミスを修正済みのファイル名を指定
import { DateTime } from "./dateFormatter.js"; 
import Pagenation from "./Pagenation";

// APIのベースURLを調整（末尾の /api 重複を防止する共通ロジック）
const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

// 画像表示用のベースURL（/api を含まないサーバーのルートURL）
const getServerRootUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    return envUrl.endsWith("/api") ? envUrl.replace(/\/api$/, "") : envUrl;
};

const API_BASE = getBaseApiUrl();
const SERVER_ROOT = getServerRootUrl();

function GetEvents() {
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

    // ページネーション計算
    const indexOfLastEvent = currentPage * itemsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(events.length / itemsPerPage);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const monthStr = String(selectedMonth).padStart(2, "0");

            // API_BASEを使用してリクエスト
            const res = await fetch(`${API_BASE}/events/${selectedYear}/${monthStr}`, {
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!res.ok) {
                if (res.status === 404) {
                    setEvents([]); // 404の時はイベントなしとして扱う
                    return;
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setEvents(Array.isArray(data) ? data : []);
            setCurrentPage(1); // 条件が変わったら1ページ目に戻す
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
            style={{ 
                marginTop: "0px",  
                padding: "20px 0", 
                marginBottom: "30px", 
                textAlign: "center", 
                backgroundImage: `url("/images/akaoni_background.png")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                color: "#333",   
            }}
        >
            <h2>月別イベント</h2>

            {/* 年選択 */}
            <div style={{ marginBottom: "15px" }}>
                <label className="selectbox">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        style={{ padding: "5px 10px", borderRadius: "5px" }}
                    >
                        {yearOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label> 
            </div>

            {/* 月選択ボタン */}
            <div className="button-group" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "5px", marginBottom: "20px" }}>
                {[...Array(12)].map((_, i) => {
                    const month = i + 1;
                    const isActive = selectedMonth === month;
                    return (
                        <button
                            key={month}
                            className={`tab-button ${isActive ? "active" : ""}`}
                            onClick={() => setSelectedMonth(month)}
                            style={{
                                padding: "8px 12px",
                                cursor: "pointer",
                                backgroundColor: isActive ? "#f93d5d" : "#fff",
                                color: isActive ? "#fff" : "#333",
                                border: "1px solid #ccc",
                                borderRadius: "4px"
                            }}
                        >
                            {month}月
                        </button>
                    );
                })}
            </div>

            {/* 選択中年月表示 */}
            <div style={{ padding: "0 10px" }}>
                <h4 style={{ fontSize: "18px", marginBottom: "15px" }}>
                    {selectedYear}年 {selectedMonth}月 のイベント
                </h4>

                {loading && <p>読み込み中です…</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {!loading && !error && events.length === 0 ? (
                    <p style={{ padding: "20px", backgroundColor: "rgba(255,255,255,0.7)", borderRadius: "8px" }}>
                        現在、この月のイベント情報はありません
                    </p>
                ) : (
                    <div className="card-list">
                        {currentEvents.map((event) => {
                            // 画像URLの構築ロジック
                            const fullImageUrl = event.image_url 
                                ? (event.image_url.startsWith('http') 
                                    ? event.image_url 
                                    : `${SERVER_ROOT}${event.image_url.startsWith('/') ? '' : '/'}${event.image_url}`)
                                : "/images/no-image.png"; // 画像がない場合のデフォルト

                            return (
                                <EventCard
                                    key={event.id}
                                    id={event.id}
                                    name={event.name}
                                    catchphrase={event.catchphrase}
                                    image={fullImageUrl}
                                    start_date={DateTime(event.start_date)}
                                    end_date={DateTime(event.end_date)}
                                    location={event.location}
                                />
                            );
                        })}
                    </div>
                )}            
            </div>

            {totalPages > 1 && (
                <Pagenation
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            )}
        </section>
    );
}

export default GetEvents;