import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// APIのベースURLを調整
const getBaseApiUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
  return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

const API_BASE = getBaseApiUrl();

export default function EventApplicationHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeType, setActiveType] = useState("events"); 
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const [dataList, setDataList] = useState({ events: [], restaurants: [] });
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  // --- マスタデータ用のステート (RestaurantForm.jsx と同じ) ---
  const [areaOptions, setAreaOptions] = useState([]);
  const [budgetOptions, setBudgetOptions] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);

  const itemsPerPage = 5;

  // --- 1. マスタデータの取得 (RestaurantForm.jsx を踏襲) ---
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [areas, budgets, genres] = await Promise.all([
          fetch(`${API_BASE}/m_areas`).then((res) => res.json()),
          fetch(`${API_BASE}/m_budgets`).then((res) => res.json()),
          fetch(`${API_BASE}/m_genres`).then((res) => res.json()),
        ]);
        setAreaOptions(areas);
        setBudgetOptions(budgets);
        setGenreOptions(genres);
      } catch (error) {
        console.error("マスタデータの取得に失敗しました", error);
      }
    };
    fetchMasters();
  }, []);

  // --- 2. 申請履歴データの取得 ---
  const fetchAllData = useCallback(async () => {
    const token = localStorage.getItem("usertoken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const headers = { 
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json" 
      };
      
      const [eventRes, restaurantRes] = await Promise.all([
        fetch(`${API_BASE}/events`, { headers }),
        fetch(`${API_BASE}/api_restaurants_history`, { headers }) 
      ]);

      if (eventRes.status === 401 || restaurantRes.status === 401) {
        alert("セッションが切れました。再度ログインしてください。");
        localStorage.removeItem("usertoken");
        navigate("/login");
        return;
      }

      const eventsData = eventRes.ok ? await eventRes.json() : [];
      const restaurantsData = restaurantRes.ok ? await restaurantRes.json() : [];

      setDataList({ 
          events: eventsData, 
          restaurants: restaurantsData 
      });
    } catch (err) {
      console.error("通信エラー:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, location.key]);

  // --- 3. IDから名称を表示するためのヘルパー関数 ---
  const getMasterLabel = (options, id) => {
    if (!id) return "未設定";
    const found = options.find((opt) => String(opt.id) === String(id));
    return found ? found.name : `不明(ID:${id})`;
  };

  // --- フィルタリングロジック ---
  const currentList = dataList[activeType] || [];
  const filteredItems = currentList.filter(item => {
    const status = Number(item.approval_status_id);
    //未承認タブ: メール認証待ち(0) または 管理者審査待ち(1)
    if (activeTab === "pending") return status === 0 || status === 1;
    //承認済みタブ: 公開中(2)
    if (activeTab === "approved") return status === 2;
    //却下タブ: 却下(3)
    if (activeTab === "rejected") return status === 3;
    return true;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // --- 削除処理 ---
  const handleAction = async (item) => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      const token = localStorage.getItem("usertoken");
      const url = `${API_BASE}/${activeType === "events" ? "events" : "restaurants"}/${item.id}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
      });
      if (res.ok) {
        alert("削除しました");
        setDataList(prev => ({ ...prev, [activeType]: prev[activeType].filter(i => i.id !== item.id) }));
      }
    } catch (err) { alert("通信エラーが発生しました"); }
  };

  const getTabStyle = (isActive) => ({
    padding: "10px 15px", cursor: "pointer", border: "none", background: "none",
    borderBottom: isActive ? "3px solid #f93d5d" : "3px solid transparent",
    color: isActive ? "#f93d5d" : "#666", fontWeight: isActive ? "bold" : "normal", fontSize: "0.9em"
  });

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", backgroundColor: "#fdfdfd", minHeight: "100vh" }}>
      <button onClick={() => navigate("/MyPage")} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#666" }}>✕</button>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>申請確認履歴</h2>

      {/* タブ切替 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px", borderBottom: "1px solid #eee" }}>
        <button onClick={() => { setActiveType("events"); setPage(1); }} style={getTabStyle(activeType === "events")}>イベント</button>
        <button onClick={() => { setActiveType("restaurants"); setPage(1); }} style={getTabStyle(activeType === "restaurants")}>飲食店</button>
      </div>

      {/* ステータス切替 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", gap: "10px" }}>
        {["pending", "approved", "rejected"].map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} 
            style={{ padding: "5px 15px", borderRadius: "20px", border: "1px solid #ddd", cursor: "pointer", fontSize: "0.85em",
                     backgroundColor: activeTab === tab ? "#666" : "#fff", color: activeTab === tab ? "#fff" : "#666" }}>
            {tab === "pending" ? "未承認" : tab === "approved" ? "承認済み" : "却下済み"}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#999" }}>読み込み中...</p>
      ) : currentItems.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999", marginTop: "50px" }}>該当するデータがありません。</p>
      ) : (
        currentItems.map(item => {
          const statusId = Number(item.approval_status_id);
          return (
            <div key={item.id} style={cardStyle}>
              <div onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <strong style={{ fontSize: "1.1em" }}>{item.name}</strong>
                  {activeTab === "pending" && (
                    <span style={{ fontSize: "0.75em", marginLeft: "10px", padding: "2px 8px", borderRadius: "10px", backgroundColor: statusId === 0 ? "#faad14" : "#1890ff", color: "white" }}>
                      {statusId === 0 ? "メール認証待ち" : "審査待ち"}
                    </span>
                  )}
                  <div style={{ fontSize: "0.8em", color: "#888", marginTop: "4px" }}>
                    {activeType === "events" ? `開催: ${item.start_date?.substring(0, 10)}` : `住所: ${item.address}`}
                  </div>
                </div>
                <span style={{ color: "#007bff", fontSize: "0.85em" }}>{expandedId === item.id ? "▲ 閉じる" : "▼ 詳細表示"}</span>
              </div>

              {expandedId === item.id && (
                <div style={cardDetailStyle}>
                  {/* 画像ギャラリー */}
                  <div style={imageGalleryStyle}>
                    {activeType === "events" ? (
                      <div style={imageWrapper}><small style={imageLabel}>画像</small>
                        {item.image_path ? <img src={item.image_path} alt="Event" style={thumbStyle} /> : <div style={noImage}>No Image</div>}
                      </div>
                    ) : (
                      <>
                        <div style={imageWrapper}><small style={imageLabel}>トップ</small>
                          {item.topimage_path ? <img src={item.topimage_path} alt="TOP" style={thumbStyle} /> : <div style={noImage}>No Image</div>}
                        </div>
                        {[1, 2, 3].map(i => (
                          <div key={i} style={imageWrapper}><small style={imageLabel}>画像{i}</small>
                            {item[`image${i}_path`] ? <img src={item[`image${i}_path`]} alt={`sub${i}`} style={thumbStyle} /> : <div style={noImage}>No Image</div>}
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {/* 詳細項目 (マスタ名称を表示) */}
                  <div style={infoGridStyle}>
                    {activeType === "events" ? (
                      <>
                        <p><strong>イベント名:</strong> {item.name}</p>
                        <p><strong>キャッチ:</strong> {item.catchphrase}</p>
                        <p><strong>期間:</strong> {item.start_date} ～ {item.end_date}</p>
                        <p><strong>場所:</strong> {item.location}</p>
                        <p><strong>主催:</strong> {item.organizer}</p>
                        <p><strong>予約:</strong> {item.is_free_participation}</p>
                        <p><strong>URL:</strong> <a href={item.url} target="_blank" rel="noreferrer">{item.url}</a></p>
                        <p><strong>説明:</strong> {item.description || "なし"}</p>
                        <p><strong>備考:</strong> {item.notes || "なし"}</p>
                      </>
                    ) : (
                      <>
                        <p><strong>店名:</strong> {item.name}</p>
                        <p><strong>キャッチ:</strong> {item.catchphrase}</p>
                        <p><strong>住所:</strong> {item.address}</p>
                        <p><strong>地域:</strong> {getMasterLabel(areaOptions, item.area_id)}</p>
                        <p><strong>ジャンル:</strong> {getMasterLabel(genreOptions, item.genre_id)}</p>
                        <p><strong>予算:</strong> {getMasterLabel(budgetOptions, item.budget_id)}</p>
                        <p><strong>TEL:</strong> {item.tel}</p>
                        <p><strong>営業時間:</strong> {item.business_hours}</p>
                        <p><strong>定休日:</strong> {item.holiday}</p>
                        <p><strong>URL:</strong> <a href={item.url} target="_blank" rel="noreferrer">{item.url}</a></p>
                        <p><strong>詳細:</strong> {item.comment || "なし"}</p>
                      </>
                    )}
                  </div>

                  {/* 修正依頼 */}
                  {statusId === 3 && item.rejection_reason && (
                    <div style={rejectionBoxStyle}><strong>⚠️ 修正依頼:</strong><br/>{item.rejection_reason}</div>
                  )}

                  <div style={actionAreaStyle}>
                    <button onClick={() => navigate(`/${activeType === 'events' ? 'EventEdit' : 'RestaurantEdit'}/${item.id}`)} style={editButtonStyle}>編集 ✏️</button>
                    <button onClick={() => handleAction(item)} style={deleteButtonStyle}>削除 ❌</button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
      

      {/* ページネーション */}
      {totalPages > 1 && (
        <div style={{ textAlign: "center", marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pageButtonStyle}>前へ</button>
          <span style={{ fontSize: "0.85em" }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={pageButtonStyle}>次へ</button>
        </div>
      )}
    </div>
  );
}

// スタイル定義
const cardStyle = { border: "1px solid #eee", borderRadius: "10px", padding: "15px", marginBottom: "15px", backgroundColor: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" };
const cardDetailStyle = { marginTop: "15px", borderTop: "1px solid #eee", paddingTop: "15px" };
const infoGridStyle = { fontSize: "14px", lineHeight: "1.7", color: "#444" };
const imageGalleryStyle = { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: "15px" };
const imageWrapper = { textAlign: "center" };
const imageLabel = { display: "block", fontSize: "10px", color: "#888", marginBottom: "3px" };
const thumbStyle = { width: "100px", height: "70px", objectFit: "cover", borderRadius: "5px", border: "1px solid #eee" };
const noImage = { width: '100px', height: '70px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#ccc', borderRadius: '5px' };
const rejectionBoxStyle = { backgroundColor: "#fff2f0", padding: "10px", borderRadius: "6px", border: "1px solid #ffccc7", color: "#cf1322", fontSize: "13px", marginTop: "15px" };
const actionAreaStyle = { marginTop: "20px", textAlign: "right", borderTop: "1px solid #eee", paddingTop: "15px" };
const editButtonStyle = { padding: "7px 15px", backgroundColor: "#fff", border: "1px solid #4a5568", borderRadius: "5px", marginRight: "8px", cursor: "pointer" };
const deleteButtonStyle = { padding: "7px 15px", backgroundColor: "#fff", border: "1px solid #ff4d4f", color: "#ff4d4f", borderRadius: "5px", cursor: "pointer" };
const pageButtonStyle = { padding: "5px 12px", cursor: "pointer", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "4px" };