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
  const { user } = context;   // ← currentUser → user に修正

  // 画像アップロード
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // 画像削除
  const handleImageRemove = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  // 入力変更
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 送信処理
  const handleEventSubmit = async () => {
    if (!user?.id) {   // ← currentUser → user に修正
      alert("ログインしてください");
      navigate("/login");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("user_id", user.id);   // ← currentUser → user に修正
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }
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
          <span style={{ color: "#666" }}>見出し画像がここに表示されます</span>
        )}
      </div>

      {/* 画像アップロードボタン */}
      {!previewUrl ? (
        <label
          style={{
            display: "inline-block",
            padding: "6px 12px",
            backgroundColor: "#aaa",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          画像を選択
          <input type="file" onChange={handleImageUpload} style={{ display: "none" }} />
        </label>
      ) : (
        <div style={{ marginBottom: "20px" }}>
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

      {/* フォームフィールド */}
      {/* ...以下はそのまま */}
      <div style={{ marginBottom: "10px" }}>
        <label>イベント名</label>
        <br />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
        />
      </div>

      {/* 他のフィールドも同様 */}
      
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