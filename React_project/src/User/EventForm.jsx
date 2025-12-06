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
  const { user } = context;

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
    if (!user?.id) {
      alert("ログインしてください");
      navigate("/login");
      return;
    }

    // --- バリデーションチェック ---

    // 1. 画像チェック (必須)
    if (!imageFile) {
      alert("見出し画像を設定してください。");
      return;
    }

    // 2. 必須項目チェック（詳細と注意事項は除外）
    const fieldLabels = {
      name: "イベント名",
      catchphrase: "見出し",
      start_date: "開始日",
      end_date: "終了日",
      location: "場所",
      url: "URL",
      organizer: "主催者",
      is_free_participation: "予約",
      // description と notes は必須から除外しました
    };

    for (const [key, label] of Object.entries(fieldLabels)) {
      if (!formData[key] || formData[key].trim() === "") {
        alert(`${label}を入力してください。\n該当しない場合は「なし」と記入してください。`);
        return;
      }
    }

    // --- 送信データ作成 ---
    const formDataToSend = new FormData();
    formDataToSend.append("user_id", user.id);
    formDataToSend.append("image", imageFile);

    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

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

      {/* 注意書きエリア */}
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
        <span style={{color: "red"}}>※</span> がついている項目はすべて必須です。<br/>
        URLなど、該当しない項目がある場合は<strong>「なし」</strong>と記入してください。
      </div>

      {/* プレビュー枠 */}
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
      <div style={{ marginTop: "10px" }}></div>
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

      {/* フォームフィールド */}
      <div style={{ marginBottom: "10px" }}>
        <label>イベント名 <span style={{ color: "red" }}>※</span></label>
        <br />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
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

      {[{ label: "場所", name: "location" }, { label: "URL", name: "url" }, { label: "主催者", name: "organizer" }].map(
        (field) => (
          <div key={field.name} style={{ marginBottom: "10px" }}>
            <label>{field.label} <span style={{ color: "red" }}>※</span></label>
            <br />
            <input
              type="text"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder="該当しない場合は「なし」と記入"
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
          <option value="要予約">要予約</option>
          <option value="自由参加">自由参加</option>
        </select>
      </div>

      {/* 詳細（任意） */}
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

      {/* 注意事項（任意） */}
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