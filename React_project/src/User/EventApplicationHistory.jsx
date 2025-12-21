import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function EventApplicationHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeType, setActiveType] = useState("events"); 
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const [dataList, setDataList] = useState({ events: [], restaurants: [] });
  const [activeTab, setActiveTab] = useState("pending");

  const itemsPerPage = 5;

  // --- データの取得関数 ---
  const fetchAllData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { 
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json" 
      };
      
      const [eventRes, restaurantRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/api/events`, { headers }),
        // ここを修正：専用の履歴取得用エンドポイントを叩く
        fetch(`${process.env.REACT_APP_API_URL}/api/api_restaurants_history`, { headers }) 
      ]);

      const eventsData = eventRes.ok ? await eventRes.json() : [];
      const restaurantsData = restaurantRes.ok ? await restaurantRes.json() : [];

      console.log("最新データを取得しました:", { events: eventsData, restaurants: restaurantsData });

      setDataList({ 
          events: eventsData, 
          restaurants: restaurantsData 
      });
    } catch (err) {
      console.error("通信エラー:", err);
    }
  }, []);

  // --- 画面表示時、および遷移から戻ってきた時に実行 ---
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, location.key]);

  // --- フィルタリングロジック ---
  const currentList = dataList[activeType] || [];
  const filteredItems = currentList.filter(item => {
    const status = Number(item.approval_status_id);
    if (activeTab === "pending") return status === 0 || status === 3;
    if (activeTab === "approved") return status === 1;
    if (activeTab === "rejected") return status === 2;
    return true;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [filteredItems, page, totalPages]);

  // --- 削除処理 ---
  const handleAction = async (item) => {
    if (!window.confirm("本当に削除しますか？")) return;

    try {
      const token = localStorage.getItem("token");
      const url = `${process.env.REACT_APP_API_URL}/api/${activeType}/${item.id}`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (res.ok) {
        alert("削除しました");
        setDataList(prev => ({
          ...prev,
          [activeType]: prev[activeType].filter(i => i.id !== item.id)
        }));
      } else {
        const errorData = await res.json();
        alert(`削除に失敗しました: ${errorData.error || "Unknown error"}`);
      }
    } catch (err) {
      alert("通信エラーが発生しました");
    }
  };

  const getTabStyle = (isActive) => ({
    padding: "10px 15px",
    cursor: "pointer",
    border: "none",
    background: "none",
    borderBottom: isActive ? "3px solid #f93d5d" : "3px solid transparent",
    color: isActive ? "#f93d5d" : "#666",
    fontWeight: isActive ? "bold" : "normal",
    fontSize: "0.9em",
    transition: "all 0.3s"
  });

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", backgroundColor: "#fdfdfd", minHeight: "100vh" }}>
      <button onClick={() => navigate("/MyPage")} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#666" }}>✕</button>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>申請確認履歴</h2>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px", borderBottom: "1px solid #eee" }}>
        <button onClick={() => { setActiveType("events"); setPage(1); setExpandedId(null); }} style={getTabStyle(activeType === "events")}>イベント</button>
        <button onClick={() => { setActiveType("restaurants"); setPage(1); setExpandedId(null); }} style={getTabStyle(activeType === "restaurants")}>飲食店</button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", gap: "10px" }}>
        {["pending", "approved", "rejected"].map(tab => (
          <button 
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(1); }} 
            style={{
              padding: "5px 15px", borderRadius: "20px", border: "1px solid #ddd",
              backgroundColor: activeTab === tab ? "#666" : "#fff",
              color: activeTab === tab ? "#fff" : "#666",
              cursor: "pointer", fontSize: "0.85em"
            }}
          >
            {tab === "pending" ? "未承認" : tab === "approved" ? "承認済み" : "拒否済み"}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999", marginTop: "50px" }}>該当するデータがありません。</p>
      ) : (
        currentItems.map(item => {
          const statusId = Number(item.approval_status_id);

          return (
            <div key={item.id} style={{ backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "8px", padding: "15px", marginBottom: "15px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
              <div 
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} 
                style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div>
                  <strong style={{ fontSize: "1.1em" }}>{item.name}</strong>
                  {activeTab === "pending" && (
                      <span style={{ 
                        fontSize: "0.7em", 
                        marginLeft: "10px", 
                        padding: "2px 8px", 
                        borderRadius: "10px", 
                        backgroundColor: statusId === 3 ? "#faad14" : "#1890ff", 
                        color: "white" 
                      }}>
                          {statusId === 3 ? "再申請を受け付けました" : "確認中"}
                      </span>
                  )}
                  <div style={{ fontSize: "0.8em", color: "#888", marginTop: "4px" }}>
                    {activeType === "events" ? `開催日: ${item.start_date?.substring(0, 10)}` : `住所: ${item.address?.substring(0, 15)}...`}
                  </div>
                </div>
                <span style={{ color: "#007bff", fontSize: "0.85em" }}>
                  {expandedId === item.id ? "▲ 閉じる" : "▼ 詳細を表示"}
                </span>
              </div>

              {expandedId === item.id && (
                <div style={{ marginTop: "15px", borderTop: "1px solid #eee", paddingTop: "15px" }}>
                  {(item.image_path || item.topimage_path || item.image_url) && (
                    <div style={{ marginBottom: "15px", textAlign: "center" }}>
                      <p style={{ fontSize: "0.8em", color: "#888", marginBottom: "5px" }}>
                        {activeType === "events" ? "見出し画像" : "トップ画像"}
                      </p>
                      <img 
                        src={item.image_path || item.topimage_path || item.image_url} 
                        alt="メイン" 
                        style={{ maxWidth: "100%", maxHeight: "250px", borderRadius: "6px", border: "1px solid #ddd" }} 
                      />
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "10px", fontSize: "0.95em", color: "#333" }}>
                    <strong>{activeType === "events" ? "イベント名" : "店名"}:</strong> <span>{item.name}</span>
                    <strong>見出し:</strong> <span>{item.catchphrase || "未入力"}</span>

                    {activeType === "events" && (
                      <>
                        <strong>開始日:</strong> <span>{item.start_date}</span>
                        <strong>終了日:</strong> <span>{item.end_date}</span>
                        <strong>場所:</strong> <span>{item.location}</span>
                        <strong>主催者:</strong> <span>{item.organizer}</span>
                        <strong>予約:</strong> 
                        <span>{Number(item.is_free_participation) === 1 ? "自由参加" : "要予約"}</span>
                      </>
                    )}

                    {activeType === "restaurants" && (
                      <>
                        <strong>住所:</strong> <span>{item.address}</span>
                        <strong>電話番号:</strong> <span>{item.tel}</span>
                        <strong>営業時間:</strong> <span>{item.business_hours}</span>
                        <strong>定休日:</strong> <span>{item.holiday}</span>
                        <strong>地域:</strong> <span>{item.area?.name || "未選択"}</span>
                        <strong>予算:</strong> <span>{item.budget?.name || "未選択"}</span>
                        <strong>ジャンル:</strong> <span>{item.genre?.name || "未選択"}</span>
                      </>
                    )}
                    
                    <strong>URL:</strong> 
                    <span>
                      {item.url && item.url !== "なし" ? 
                        <a href={item.url} target="_blank" rel="noreferrer" style={{ color: "#007bff", wordBreak: "break-all" }}>{item.url}</a> : "なし"
                      }
                    </span>
                  </div>

                  <div style={{ marginTop: "15px", padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "6px" }}>
                    <strong style={{ fontSize: "0.9em", color: "#555" }}>
                      {activeType === "events" ? "詳細説明" : "店舗紹介・コメント"}
                    </strong>
                    <p style={{ margin: "5px 0", fontSize: "0.95em", whiteSpace: "pre-wrap" }}>
                      {activeType === "events" ? (item.description || "なし") : (item.comment || "なし")}
                    </p>
                  </div>

                  {statusId === 2 && item.rejection_reason && (
                    <div style={{ marginTop: "15px", padding: "12px", backgroundColor: "#fff5f5", border: "1px dotted #fc8181", borderRadius: "6px", color: "#c53030", fontSize: "0.9em" }}>
                      <strong> 修正依頼メッセージ:</strong>
                      <div style={{ marginTop: "4px" }}>{item.rejection_reason}</div>
                    </div>
                  )}

                  <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                    {statusId !== 0 && (
                      <button 
                        onClick={() => navigate(`/${activeType === 'events' ? 'EventEdit' : 'RestaurantEdit'}/${item.id}`)} 
                        style={{ padding: "8px 20px", cursor: "pointer", backgroundColor: "#fff", border: "1px solid #4a5568", borderRadius: "5px" }}
                      >
                        編集 ✏️
                      </button>
                    )}
                    <button 
                      onClick={() => handleAction(item)}
                      style={{ padding: "8px 20px", cursor: "pointer", backgroundColor: "#fff", border: "1px solid #e53e3e", color: "#e53e3e", borderRadius: "5px" }}
                    >
                      削除 ❌
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}

      {totalPages > 1 && (
        <div style={{ textAlign: "center", marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: "15px" }}>
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>前へ</button>
          <span style={{ fontSize: "0.9em" }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>次へ</button>
        </div>
      )}
    </div>
  );
}