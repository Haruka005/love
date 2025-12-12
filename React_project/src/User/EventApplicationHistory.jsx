// EventApplicationHistory.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EventApplicationHistory() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("pending"); // タブ状態

  const itemsPerPage = 5;
  const startIndex = (page - 1) * itemsPerPage;
  const filteredEvents = events.filter(event => {
    if (activeTab === "pending") return event.approval_status_id === 0;
    if (activeTab === "approved") return event.approval_status_id === 1;
    if (activeTab === "rejected") return event.approval_status_id === 2;
    return true;
  });
  const currentEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [filteredEvents, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (res.ok) {
        setEvents(events.filter((e) => e.id !== id));
        alert("削除しました");
      } else {
        alert("削除に失敗しました");
      }
    } catch (err) {
      console.error("通信エラー:", err);
      alert("通信エラーが発生しました");
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/events", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (err) {
        console.error("通信エラー:", err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <button onClick={() => navigate("/MyPage")} style={{ position: "absolute", top: "10px", left: "10px" }}>✕</button>
      <h2 style={{ textAlign: "center" }}>イベント申請確認履歴</h2>

      {/* タブ切り替え */}
      <nav style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("pending")}>未承認</button>
        <button onClick={() => setActiveTab("approved")}>承認済み</button>
        <button onClick={() => setActiveTab("rejected")}>拒否済み</button>
      </nav>

      {filteredEvents.length === 0 ? (
        <p>このタブにはイベントがありません。</p>
      ) : (
        currentEvents.map(event => (
          <div key={event.id} style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "15px" }}>
            <div onClick={() => setExpandedId(expandedId === event.id ? null : event.id)} style={{ cursor: "pointer" }}>
              <strong>{event.name}</strong>
              <span style={{ float: "right" }}>
                {expandedId === event.id ? "▲ 詳細を閉じる" : "▼ 詳細を見る"}
              </span>
            </div>
            <p>
              {event.approval_status_id === 1 && <span style={{ color: "green" }}>承認済</span>}
              {event.approval_status_id === 0 && <span style={{ color: "orange" }}>未承認</span>}
              {event.approval_status_id === 2 && <span style={{ color: "red" }}>拒否</span>}
            </p>

            {expandedId === event.id && (
              <div style={{ marginTop: "10px" }}>
                <p>見出し: {event.catchphrase}</p>
                <p>開始日：{event.start_date}</p>
                <p>終了日：{event.end_date}</p>
                <p>場所：{event.location ?? "未設定"}</p>
                <p>URL：{event.url ?? "未設定"}</p>
                <p>主催者：{event.organizer ?? "未設定"}</p>
                <p>予約：
                  {Number(event.is_free_participation) === 0 ? "要予約"
                  : Number(event.is_free_participation) === 1 ? "自由参加"
                  : "未設定"}
                </p>
                 <p>説明: {event.description}</p>
                <p>注意事項: {event.notes}</p>
                {event.rejection_reason && (
                  <p style={{ color: "red" }}>管理者メッセージ: {event.rejection_reason}</p>
                )}
                {event.image_path && (
                  <img src={event.image_path} alt="イベント画像" style={{ maxWidth: "100%", marginTop: "10px" }} />
                )}

                {/* アクションボタン */}
                <div style={{ marginTop: "20px", textAlign: "right" }}>
                  {/* 編集は常に可能 → 再申請も兼ねる */}
                  <button onClick={() => navigate(`/EventEdit/${event.id}`)} style={{ marginRight: "10px" }}>
                    編集 ✏️
                  </button>

                  {/* 削除は未承認と拒否済みのみ */}
                  {(event.approval_status_id === 0 || event.approval_status_id === 2) && (
                    <button onClick={() => handleDelete(event.id)}>削除 ❌</button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {/* ページ送り */}
      <div style={{ textAlign: "center" }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>前のページ</button>
        <span> ページ {page} / {totalPages || 1} </span>
        <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>次のページ</button>
      </div>
    </div>
  );
}