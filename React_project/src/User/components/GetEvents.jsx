import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
// スペルミスを修正 (dateForatter -> dateFormatter)
import { DateTime } from "./dateFormatter.js"; 
import Pagenation from "./Pagenation";

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

  // .envからベースURLを取得
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // ページネーション処理
  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / itemsPerPage);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const monthStr = String(selectedMonth).padStart(2, "0");

        // 共通の環境変数を使用してURLを構築
        const res = await fetch(`${API_BASE_URL}/events/${selectedYear}/${monthStr}`);

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        setEvents(data);
        setError(null);
        setCurrentPage(1); // 条件が変わったら1ページ目に戻す

      } catch (err) {
        console.error(err);
        setError("イベント取得に失敗しました");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    if (API_BASE_URL) {
      fetchEvents();
    }
  }, [selectedYear, selectedMonth, API_BASE_URL]);

  return (
    <section 
      style={{ 
        marginTop: "0px",  
        padding: "10px 0", 
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
      <div style={{ marginBottom: "10px" }}>
        <label className="selectbox" >
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
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
      <div className="button-group">
        {[...Array(12)].map((_, i) => {
          const month = i + 1;
          return (
           <button
              key={month}
              className={`tab-button ${selectedMonth === month ? "active" : ""}`}
              onClick={() => setSelectedMonth(month)}
            >
              {month}月
            </button>
          );
        })}
      </div>

      {/* 選択中年月 */}
      <div>
        <h4 style={{ fontSize: "18px", marginBottom: "10px" }}>
          {selectedYear}年 {selectedMonth}月 のイベント
        </h4>

        {loading && <p>読み込み中です…</p>}
        {error && <p style={{ color: "red" }}>エラー: {error}</p>}

        {!loading && !error && events.length === 0 ? (
          <p>イベント情報はありません</p>
        ) : (
          <div className="card-list">
            {currentEvents.map((event) => (  
              <EventCard
                key={event.id}
                id={event.id}
                name={event.name}
                catchphrase={event.catchphrase}
                image={event.image_url}
                start_date={DateTime(event.start_date)}
                end_date={DateTime(event.end_date)}
                location={event.location}
              />
            ))}
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