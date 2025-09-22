import React, { useState } from "react";

function EventForm() {
  const [formData, setFormData] = useState({
    title: "",
    headline: "",
    location: "",
    target: "",
    items: "",
    reservation: "",
    url: "",
    organizer: "",
    details: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      style={{
        // 画面の余白
        padding: "20px",
        // フォント
        fontFamily: "sans-serif",
        // 横幅制限
        maxWidth: "500px",
        // 中央寄せ
        margin: "0 auto",
      }}
    >
      {/* ページタイトル */}
      <h2 style={{ textAlign: "center", marginTop: "0" }}>イベント申請</h2>

      {/* 見出し画像の仮表示エリア */}
      <div
        style={{
          width: "100%",
          height: "150px",
          backgroundColor: "#ddd",
          borderRadius: "6px",
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
        }}
      >
        見出し画像（仮）
      </div>

      {/* UPLOADボタン（仮） */}
      <button
        onClick={() => alert("画像アップロード処理をここに追加")}
        style={{
          display: "block",
          margin: "0 auto 20px",
          padding: "10px 20px",
          backgroundColor: "#ccc",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        UPLOAD
      </button>

      {/* 入力フォーム（各項目） */}
      {[
        { label: "タイトル", name: "title" },
        { label: "見出し", name: "headline" },
        { label: "場所", name: "location" },
        { label: "対象", name: "target" },
        { label: "持ち物", name: "items" },
        { label: "予約", name: "reservation" },
        { label: "URL", name: "url" },
        { label: "主催者", name: "organizer" },
      ].map((field) => (
        <div key={field.name} style={{ marginBottom: "10px" }}>
          <label>{field.label}</label><br />
          <input
            type="text"
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
      ))}

      {/* 詳細欄 */}
      <div style={{ marginBottom: "10px" }}>
        <label>詳細</label><br />
        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
          rows="3"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* 注意事項欄 */}
      <div style={{ marginBottom: "20px" }}>
        <label>注意事項</label><br />
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* 申請ボタン */}
      <button
        onClick={() => alert("申請内容を送信しました")}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        申請する
      </button>
    </div>
  );
}

export default EventForm;