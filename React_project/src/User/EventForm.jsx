// src/User/EventForm.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

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
  const { currentUser } = context;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEventSubmit = async () => {
    if (!currentUser?.id) {
      alert("ログインしてください");
      navigate("/login");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("user_id", currentUser.id);
    formDataToSend.append("image", imageFile);
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    const requiredFields = [
      { key: "name", label: "タイトル" },
      { key: "catchphrase", label: "見出し" },
      { key: "start_date", label: "開始日" },
      { key: "end_date", label: "終了日" },
    ];
    for (const field of requiredFields) {
      if (!formData[field.key]) {
        alert(`${field.label}を入力してください`);
        return;
      }
    }

    const response = await fetch("http://localhost:8000/api/store-event-data", {
      method: "POST",
      body: formDataToSend,
      credentials: "include",
    });

    if (response.ok) {
      alert("イベント申請が完了しました！");
      navigate("/MyPage");
    } else {
      alert("申請に失敗しました。");
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

      {/* プレビュー枠 */}
      <div style={{ width: "100%", height: "150px", backgroundColor: "#ddd", marginBottom: "10px" }}>
        {previewUrl ? (
          <img src={previewUrl} alt="プレビュー" style={{ maxWidth: "100%", maxHeight: "100%" }} />
        ) : (
          <span>見出し画像（仮）</span>
        )}
      </div>

      {/* 画像アップロード */}
      <input type="file" onChange={handleImageUpload} style={{ display: "block", marginBottom: "20px" }} />

      {/* タイトル */}
      <div style={{ marginBottom: "10px" }}>
        <label>タイトル</label>
        <br />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
        />
      </div>

      {/* 見出し */}
      <div style={{ marginBottom: "10px" }}>
        <label>見出し</label>
        <br />
        <input
          type="text"
          name="catchphrase"
          value={formData.catchphrase}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
        />
      </div>

      {/* 開始日 */}
      <div style={{ marginBottom: "10px" }}>
        <label>開始日</label>
        <br />
        <input
          type="datetime-local"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
        />
      </div>

      {/* 終了日 */}
      <div style={{ marginBottom: "10px" }}>
        <label>終了日</label>
        <br />
        <input
          type="datetime-local"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
        />
      </div>

      {/* その他のフィールド */}
      {[
        { label: "場所", name: "location" },
        { label: "URL", name: "url" },
        { label: "主催者", name: "organizer" },
      ].map((field) => (
        <div key={field.name} style={{ marginBottom: "10px" }}>
          <label>{field.label}</label>
          <br />
          <input
            type="text"
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
          />
        </div>
      ))}

      {/* 予約選択 */}
      <div style={{ marginBottom: "10px" }}>
        <label>予約</label>
        <br />
        <select
          name="is_free_participation"
          value={formData.is_free_participation}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
        >
          <option value="">選択してください</option>
          <option value="要予約">要予約</option>
          <option value="自由参加">自由参加</option>
        </select>
      </div>

      {/* 詳細 */}
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

      {/* 注意事項 */}
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

      {/* 申請ボタン */}
      <button
        onClick={handleEventSubmit}
        style={{ width: "100%", padding: "12px", backgroundColor: "#a1a5a1ff", color: "white", border: "none" }}
      >
        申請する
      </button>
    </div>
  );
}

export default EventForm;