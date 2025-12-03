// EventApplicationHistory.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EventApplicationHistory() {
  const navigate = useNavigate();

  // 展開されているイベントのIDを保存する状態変数（nullなら何も開いていない）
  const [expandedId, setExpandedId] = useState(null);

  // ページ番号の状態
  const [page, setPage] = useState(1);

  // イベント申請履歴（APIから取得）
  const [events, setEvents] = useState([]);

  // データ取得
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/events", {
          credentials: "include", // 認証が必要なら追加
        });
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        } else {
          console.error("イベント取得失敗");
        }
      } catch (err) {
        console.error("通信エラー:", err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        maxWidth: "500px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* ✕ 閉じるボタン */}
      <button
        onClick={() => navigate("/MyPage")}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "#eee",
          color: "#333",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        ✕
      </button>

      <h2 style={{ textAlign: "center", marginTop: "0" }}>
        イベント申請確認履歴
      </h2>

      {/* イベントカード一覧 */}
      {events.length === 0 ? (
        <p>イベント申請履歴はまだありません。</p>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#f9f9f9",
            }}
          >
            {/* タイトル部分 */}
            <div
              onClick={() =>
                setExpandedId(expandedId === event.id ? null : event.id)
              }
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
                marginBottom: "5px",
              }}
            >
              {event.title}
            </div>

            {/* 詳細表示 */}
            {expandedId === event.id && (
              <div style={{ fontSize: "14px", color: "#555" }}>
                <p>開催日：{event.date}</p>

                {/* 画像 */}
                <div
                  style={{
                    width: "100%",
                    height: "120px",
                    backgroundColor: "#ddd",
                    borderRadius: "4px",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#666",
                  }}
                >
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "画像なし"
                  )}
                </div>

                <p>{event.description}</p>

                {/* 編集ボタン */}
                <button onClick={() => navigate(`/EventEdit/${event.id}`)}>
                  編集
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {/* ページ送り（ダミー構造） */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          前のページ
        </button>
        <span style={{ margin: "0 10px" }}>ページ {page}</span>
        <button onClick={() => setPage(page + 1)}>次のページ</button>
      </div>
    </div>
  );
}