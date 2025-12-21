// src/User/EventForm.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.js";

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function EventForm() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    catchphrase: "",
    start_date: "",
    end_date: "",
    location: "",
    is_free_participation: "",
    url: "",
    organizer: "",
    description: "",
    notes: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const context = useContext(AuthContext);
  if (!context) {
    return <p>ログイン情報が取得できません。ログインしてください。</p>;
  }
  const { user } = context;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_SIZE_BYTES) {
      alert(`ファイルサイズが大きすぎます。${MAX_SIZE_MB}MB以下の画像を選択してください。`);
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEventSubmit = async () => {
    if (!user?.id) {
      alert("ログインしてください");
      navigate("/login");
      return;
    }

    if (!imageFile) {
      alert("見出し画像を設定してください。");
      return;
    }

    // バリデーション
    const fieldLabels = {
      name: "イベント名",
      catchphrase: "見出し",
      start_date: "開始日",
      end_date: "終了日",
      location: "場所",
      url: "URL",
      organizer: "主催者",
      is_free_participation: "予約",
    };

    for (const [key, label] of Object.entries(fieldLabels)) {
      if (!formData[key] || formData[key].trim() === "") {
        alert(`${label}を入力してください。\n該当しない場合は「なし」と記入してください。`);
        return;
      }
    }

    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    if (start >= end) {
      alert("終了日は開始日より後に設定してください。");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("user_id", user.id);
    formDataToSend.append("image", imageFile);

    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    // --- レストラン申請と同じ形式に修正 ---
    const token = localStorage.getItem("token");
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${apiUrl}/api/store-event-data`, {
        method: "POST",
        body: formDataToSend,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          // FormData送信時はContent-Typeを指定しない
        },
      });

      if (response.ok) {
        alert("イベント申請が完了しました！\n管理者による承認後に掲載されます。");
        navigate("/EventApplicationHistory");
      } else if (response.status === 401) {
        alert("セッションが切れました。再度ログインしてください。");
        navigate("/login");
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error details:", errorData);
        alert("申請に失敗しました。内容を確認してください。");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("サーバーとの通信に失敗しました。");
    }
  };

  return (
    <div style={{ position: "relative", padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      {/* 閉じるボタン */}
      <button
        onClick={() => navigate("/MyPage")}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "#eee",
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

      <h2 style={{ textAlign: "center" }}>イベント申請</h2>

      {/* 見出し画像エリア */}
      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
        見出し画像 <span style={{ color: "red" }}>※</span>
      </label>
      <div
        style={{
          width: "100%",
          marginBottom: "10px",
          textAlign: "center",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="プレビュー"
            style={{ maxWidth: "100%", height: "auto", borderRadius: "6px" }}
          />
        ) : (
          <span style={{ color: "#666" }}>画像がここに表示されます</span>
        )}

        <div style={{ marginTop: "10px" }}>
          {!previewUrl ? (
            <label
              style={{
                display: "inline-block",
                padding: "6px 10px",
                width: "150px",
                backgroundColor: "#aaa",
                color: "white",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              画像を選択
              <input type="file" onChange={handleImageUpload} style={{ display: "none" }} />
            </label>
          ) : (
            <div style={{ marginBottom: "20px", marginTop: "10px" }}>
              <button
                onClick={handleImageRemove}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#aaa",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                削除
              </button>
              <label
                style={{
                  display: "inline-block",
                  padding: "8px 16px",
                  backgroundColor: "#aaa",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                変更
                <input type="file" onChange={handleImageUpload} style={{ display: "none" }} />
              </label>
            </div>
          )}
        </div>
      </div>

      <div style={{
        backgroundColor: "#fff3cd",
        border: "1px solid #ffeeba",
        color: "#856404",
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "20px",
        fontSize: "0.9rem",
        lineHeight: "1.5"
      }}>
        <strong>【入力について】</strong><br/>
        <span style={{color: "red"}}>※</span> がついている項目は必須です。<br/>
        該当しない場合は「なし」と記入してください。<br/>
        画像は<strong>5MB以下</strong>でアップロードしてください
      </div>

      {/* フォーム各項目 */}
      <div style={{ marginBottom: "10px" }}>
        <label>イベント名 <span style={{ color: "red" }}>※</span></label>
        <br />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="例：鬼火祭り2025"
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>見出し <span style={{ color: "red" }}>※</span></label>
        <br />
        <input
          type="text"
          name="catchphrase"
          value={formData.catchphrase}
          onChange={handleChange}
          placeholder="例：湯けむりに包まれる幻想の夜"
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>開始日 <span style={{ color: "red" }}>※</span></label>
        <br />
        <input
          type="datetime-local"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>終了日 <span style={{ color: "red" }}>※</span></label>
        <br />
        <input
          type="datetime-local"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
        />
      </div>

      {[{ label: "場所", name: "location", placeholder: "例：温泉街広場" },
        { label: "URL", name: "url", placeholder: "例：https://example.com" },
        { label: "主催者", name: "organizer", placeholder: "例：観光協会" }].map(
        (field) => (
          <div key={field.name} style={{ marginBottom: "10px" }}>
            <label>{field.label} <span style={{ color: "red" }}>※</span></label>
            <br />
            <input
              type="text"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
            />
          </div>
        )
      )}

      <div style={{ marginBottom: "10px" }}>
        <label>予約 <span style={{ color: "red" }}>※</span></label>
        <br />
        <select
          name="is_free_participation"
          value={formData.is_free_participation}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
        >
          <option value="">選択してください</option>
          <option value={0}>要予約</option>
          <option value={1}>自由参加</option>
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>詳細</label>
        <br />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>注意事項</label>
        <br />
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
        />
      </div>

      <button
        onClick={handleEventSubmit}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#a1a5a1ff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        申請する
      </button>
    </div>
  );
}

export default EventForm;