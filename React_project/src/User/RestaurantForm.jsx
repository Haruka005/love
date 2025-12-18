// src/User/RestaurantForm.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function RestaurantForm() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    topimages: [null], // トップ画像 (配列の0番目を使用)
    images: [null, null, null], // 外観・内観画像 (最大3枚)
    name: "",
    url: "",
    catchphrase: "",
    comment: "",
    budget_id: "",
    address: "",
    latitude: "",
    longitude: "",
    genre_id: "",
    area_id: "",
    tel: "",
    business_hours: "",
    holiday: "",
  });

  const [areaOptions, setAreaOptions] = useState([]);
  const [budgetOptions, setBudgetOptions] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [areas, budgets, genres] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/m_areas").then((res) => res.json()),
          fetch("http://127.0.0.1:8000/api/m_budgets").then((res) => res.json()),
          fetch("http://127.0.0.1:8000/api/m_genres").then((res) => res.json()),
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = async (e) => {
    const address = e.target.value;
    setFormData((prev) => ({ ...prev, address }));
    if (address.length > 3) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/geocode?q=${encodeURIComponent(address)}`);
        const data = await res.json();
        if (data.length > 0) {
          const { lat, lon } = data[0];
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lon,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            latitude: "42.4123",
            longitude: "141.2063",
          }));
        }
      } catch (error) {
        console.error("位置情報取得失敗:", error);
        setFormData((prev) => ({
          ...prev,
          latitude: "42.4123",
          longitude: "141.2063",
        }));
      }
    }
  };

  const MAX_SIZE_MB = 5;

  const handleTopImageChange = (file) => {
    if (file && file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`ファイルサイズが大きすぎます。${MAX_SIZE_MB}MB以下の画像を選択してください。`);
      return;
    }
    const newTopImages = [...formData.topimages];
    newTopImages[0] = file;
    setFormData((prev) => ({ ...prev, topimages: newTopImages }));
  };

  const handleTopImageRemove = () => {
    const newTopImages = [...formData.topimages];
    newTopImages[0] = null;
    setFormData((prev) => ({ ...prev, topimages: newTopImages }));
  };

  const handleSubImageChange = (index, file) => {
    if (file && file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`ファイルサイズが大きすぎます。${MAX_SIZE_MB}MB以下の画像を選択してください。`);
      return;
    }
    const newImages = [...formData.images];
    newImages[index] = file;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubImageRemove = (index) => {
    const newImages = [...formData.images];
    newImages[index] = null;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  // --- 送信処理 ---
  const handleRestaurantSubmit = async () => {
    if (!user?.id) {
      alert("ログインしてください");
      navigate("/login");
      return;
    }

    if (!formData.topimages[0]) {
      alert("トップ画像を設定してください。");
      return;
    }

    const requiredFields = {
      name: "店名",
      catchphrase: "見出し",
      url: "URL",
      tel: "電話番号",
      address: "住所",
      area_id: "地域",
      business_hours: "営業時間",
      holiday: "定休日",
      budget_id: "予算",
      genre_id: "ジャンル",
    };

    for (const [key, label] of Object.entries(requiredFields)) {
      const value = formData[key];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        alert(`${label}を入力（または選択）してください。\n該当しない場合は「なし」と記入してください。`);
        return;
      }
    }

    const formDataToSend = new FormData();
    
    // 1. 基本データ
    formDataToSend.append("user_id", user.id);
    formDataToSend.append("latitude", formData.latitude || "42.4123");
    formDataToSend.append("longitude", formData.longitude || "141.2063");

    // 2. 画像データ (Laravelのバリデーション名に合わせる)
    if (formData.topimages[0]) {
      formDataToSend.append("topimage", formData.topimages[0]);
    }

    formData.images.forEach((img, index) => {
      if (img) {
        formDataToSend.append(`image${index + 1}`, img);
      }
    });

    // 3. テキストフィールドを一括追加 (画像と既に送ったものは除外)
    Object.entries(formData).forEach(([key, value]) => {
      if (!["topimages", "images", "latitude", "longitude"].includes(key)) {
        formDataToSend.append(key, value);
      }
    });

    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

      const response = await fetch(`${apiUrl}/api/store-restaurant-data`, {
        method: "POST",
        body: formDataToSend,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        alert("店舗情報を送信しました！");
        navigate("/MyPage");
      } else if (response.status === 422) {
        const errorData = await response.json();
        console.error("バリデーションエラー詳細:", errorData.errors);
        alert("入力内容に不備があります。コンソールを確認してください。");
      } else {
        alert(`申請に失敗しました。ステータス: ${response.status}`);
      }
    } catch (error) {
      console.error("送信エラー:", error);
      alert("送信中にエラーが発生しました。");
    }
  };

  const renderImageUploader = (file, label, onUpload, onRemove, isRequired = false) => {
    const previewUrl = file ? URL.createObjectURL(file) : null;

    return (
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
          {label} {isRequired && <span style={{ color: "red" }}>※</span>}
        </label>
        
        <div style={{ width: "100%", marginBottom: "10px", textAlign: "center", border: "1px solid #ccc", borderRadius: "8px", padding: "10px", backgroundColor: "#f9f9f9" }}>
          {previewUrl ? (
            <img src={previewUrl} alt="プレビュー" style={{ maxWidth: "100%", height: "auto", borderRadius: "6px" }} />
          ) : (
            <span style={{ color: "#666" }}>画像がここに表示されます</span>
          )}

          <div style={{ marginTop: "10px" }}>
            {!previewUrl ? (
              <label style={{ display: "inline-block", padding: "6px 12px", backgroundColor: "#aaa", color: "white", borderRadius: "5px", cursor: "pointer" }}>
                画像を選択
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        alert("画像サイズは5MB以下にしてください");
                        e.target.value = "";
                        return;
                      }
                      onUpload(file);
                    }
                  }}
                  style={{ display: "none" }}
                />
              </label>
            ) : (
              <div>
                <button onClick={onRemove} style={{ padding: "8px 16px", backgroundColor: "#aaa", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "10px" }}>
                  削除
                </button>
                <label style={{ display: "inline-block", padding: "8px 16px", backgroundColor: "#aaa", color: "white", borderRadius: "5px", cursor: "pointer" }}>
                   変更
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert("画像サイズは5MB以下にしてください");
                            e.target.value = "";
                            return;
                          }
                          onUpload(file);
                        }
                      }}
                      style={{ display: "none" }}
                    />
                  </label>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative", padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/MyPage")}
        style={{ position: "absolute", top: "10px", left: "10px", backgroundColor: "#eee", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px", cursor: "pointer" }}
      >
        ✕
      </button>

      <h2 style={{ textAlign: "center" }}>店舗情報登録</h2>

      <div style={{ backgroundColor: "#fff3cd", border: "1px solid #ffeeba", color: "#856404", padding: "10px", borderRadius: "5px", marginBottom: "20px", fontSize: "0.9rem", lineHeight: "1.5" }}>
        <strong>【入力について】</strong><br />
        <span style={{ color: "red" }}>※</span> がついている項目はすべて必須です。<br />
        URLなど、該当しない項目がある場合は<strong>「なし」</strong>と記入してください。<br />
        画像は<strong>5MB以下</strong>でアップロードしてください。
      </div>

      {renderImageUploader(formData.topimages[0], "トップ画像", handleTopImageChange, handleTopImageRemove, true)}

      {[0, 1, 2].map((i) => (
        <div key={i}>
          {renderImageUploader(formData.images[i], `外観・内観・メニュー画像 ${i + 1}`, (file) => handleSubImageChange(i, file), () => handleSubImageRemove(i), false)}
        </div>
      ))}

      <div style={{ marginBottom: "10px" }}>
        <label>店名 <span style={{ color: "red" }}>※</span></label><br />
        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="例：〇〇レストラン" style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }} />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>見出し<span style={{ color: "red" }}>※</span></label><br />
        <input type="text" name="catchphrase" value={formData.catchphrase} onChange={handleChange} required placeholder="例：地元食材をふんだんに使ったレストラン" style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }} />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>住所 <span style={{ color: "red" }}>※</span></label><br />
        <input type="text" name="address" value={formData.address} onChange={handleAddressChange} required placeholder="例：北海道室蘭市〇〇町1-2-3" style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }} />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>地域（1つ選択） <span style={{ color: "red" }}>※</span></label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "5px" }}>
          {areaOptions.map((area) => (
            <label key={area.id} style={{ display: "flex", alignItems: "center" }}>
              <input type="radio" name="area_id" value={area.id} checked={formData.area_id === String(area.id)} onChange={handleChange} required style={{ marginRight: "5px" }} />
              {area.name}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>営業時間 <span style={{ color: "red" }}>※</span></label><br />
        <input type="text" name="business_hours" value={formData.business_hours} onChange={handleChange} required placeholder="例：10:00～22:00" style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }} />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>定休日 <span style={{ color: "red" }}>※</span></label><br />
        <input type="text" name="holiday" value={formData.holiday} onChange={handleChange} required placeholder="例：毎週月曜日" style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }} />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>電話番号 <span style={{ color: "red" }}>※</span></label><br />
        <input type="text" name="tel" value={formData.tel} onChange={handleChange} required placeholder="例：090-1234-5678" style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }} />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>URL</label><br />
        <input type="text" name="url" value={formData.url} onChange={handleChange} placeholder="例：https://example.com または なし" style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }} />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>予算（1つ選択） <span style={{ color: "red" }}>※</span></label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "5px" }}>
          {budgetOptions.map((budget) => (
            <label key={budget.id} style={{ display: "flex", alignItems: "center" }}>
              <input type="radio" name="budget_id" value={budget.id} checked={formData.budget_id === String(budget.id)} onChange={handleChange} required style={{ marginRight: "5px" }} />
              {budget.name}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>ジャンル（1つ選択） <span style={{ color: "red" }}>※</span></label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "5px" }}>
          {genreOptions.map((genre) => (
            <label key={genre.id} style={{ display: "flex", alignItems: "center" }}>
              <input type="radio" name="genre_id" value={genre.id} checked={formData.genre_id === String(genre.id)} onChange={handleChange} required style={{ marginRight: "5px" }} />
              {genre.name}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>詳細</label><br />
        <textarea name="comment" value={formData.comment} onChange={handleChange} rows={4} placeholder="任意入力です" style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }} />
      </div>

      <button
        onClick={handleRestaurantSubmit}
        style={{ width: "100%", padding: "12px", backgroundColor: "#a1a5a1", color: "white", border: "none", cursor: "pointer" }}
      >
        登録する
      </button>
    </div>
  );
}

export default RestaurantForm;