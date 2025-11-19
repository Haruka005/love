//イベント申請フォーム
//今後拡張として、複数画像対応、画像削除、画像を再アップロードする
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./components/AuthContext";


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
  //const [previewUrl, setPreviewUrl] = useState(null);
const { currentUser, isLoggedIn, login, logout } = useContext(AuthContext);

  const handleImageUpload = async (e) => {
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

  //nullで送信されるのを防ぐため
  const requiredFields = [
      { key: "name", label: "タイトル" },
      { key: "catchphrase", label: "見出し" },
      { key: "start_date", label: "開始日" },
      { key: "end_date", label: "終了日" },
  ];
    for(const field of requiredFields){
      if(!formData[field.key]){
        alert('${field.label}を入力してください');
        return;
      }
    }

  const response =await fetch("http://localhost:8000/api/store-event-data", {
    method: "POST",
    body: formDataToSend,
    credentials: "include",
  });

  //↑でresponseに入れた答えを使用しif文(boolean型)
  if (response.ok) {
  alert("イベント申請が完了しました！");
  navigate("/Mypage");
  } else {
  alert("申請に失敗しました。");
  }
};

  return (
    <div style={{
      position: "relative",
      padding: "20px",
      fontFamily: "sans-serif",
      maxWidth: "500px",
      margin: "0 auto",
    }}>
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
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        ✕
      </button>

      <h2 style={{ textAlign: "center", marginTop: "0" }}>イベント申請</h2>

      <div style={{
        width: "100%",
        height: "150px",
        backgroundColor: "#ddd",
        borderRadius: "6px",
        marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#666",
      }}>
         {previewUrl ? (
          <img
            src={previewUrl}
            alt="プレビュー"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
          />
        ) : (
         <span>見出し画像（仮）</span>
        )}
      </div>

      <input
        type="file"
        onChange={handleImageUpload}
        style={{ display: "block", margin: "0 auto 20px" }}
      />
      
      {/*入力欄*/}
      {[
        { label: "タイトル", name: "name" },
        { label: "見出し", name: "catchphrase" },
        { label: "開始日", name: "start_date" },
        { label: "終了日", name: "end_date" },
        { label: "場所", name: "location" },
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

      <div style={{ marginBottom: "10px" }}>
        <label>予約</label><br />
        <select
          name="is_free_participation"
          value={formData.is_free_participation}
          onChange={handleChange}
          style={{
              width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">選択してください</option>
          <option value="要予約">要予約</option>
          <option value="自由参加">自由参加</option>
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>詳細</label><br />
        <textarea
          name="description"
          value={formData.description}
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

      <button
        onClick={handleEventSubmit}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#a1a5a1ff",
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
