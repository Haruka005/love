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
    catchphrase: "",
    url: "",
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
          // デフォルト値など
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

  // --- 画像処理用ハンドラ ---

  // トップ画像の変更
  const handleTopImageChange = (file) => {
    const newTopImages = [...formData.topimages];
    newTopImages[0] = file;
    setFormData((prev) => ({ ...prev, topimages: newTopImages }));
  };

  // トップ画像の削除
  const handleTopImageRemove = () => {
    const newTopImages = [...formData.topimages];
    newTopImages[0] = null;
    setFormData((prev) => ({ ...prev, topimages: newTopImages }));
  };

  // サブ画像（外観・内観）の変更
  const handleSubImageChange = (index, file) => {
    const newImages = [...formData.images];
    newImages[index] = file;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  // サブ画像の削除
  const handleSubImageRemove = (index) => {
    const newImages = [...formData.images];
    newImages[index] = null;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleRestaurantSubmit = async () => {
    if (!user?.id) {
      alert("ログインしてください");
      navigate("/login");
      return;
    }

    //必須項目
    const requiredFields = {
      name: "店名",
      address: "住所",
      genre_id: "ジャンル",
      area_id: "地域",
      budget_id: "予算",
    };

    let missingFieldLabel = null;

    for (const key in requiredFields) {
      // 文字列フィールドの場合、空文字かどうかチェック
      if (typeof formData[key] === 'string' && formData[key].trim() === "") {
          missingFieldLabel = requiredFields[key];
          break;
      }
      // 数値IDフィールドの場合、空文字または0でないかチェック
      if (["genre_id", "area_id", "budget_id"].includes(key) && (formData[key] === "" || formData[key] === "0")) {
          missingFieldLabel = requiredFields[key];
          break;
      }
    }

    if (missingFieldLabel) {
        alert(`${missingFieldLabel} は必須項目です。入力（または選択）してください。`);
        return; //必須項目が足りない場合はここで処理を中断
    }

    const latitude = formData.latitude || "42.4123";
    const longitude = formData.longitude || "141.2063";

    const formDataToSend = new FormData();
    formDataToSend.append("user_id", user.id);

    // トップ画像
    if (formData.topimages[0]) {
      formDataToSend.append("topimages[]", formData.topimages[0]);
    }
    // サブ画像
    formData.images.forEach((img) => {
      if (img) {
        formDataToSend.append("images[]", img);
      }
    });

    formDataToSend.append("genre_id", formData.genre_id);
    formDataToSend.append("area_id", formData.area_id);
    formDataToSend.append("budget_id", formData.budget_id);

    Object.entries(formData).forEach(([key, value]) => {
      if (!["topimages", "images", "genre_id", "area_id", "budget_id", "latitude", "longitude"].includes(key)) {
        formDataToSend.append(key, value);
      }
    });

    formDataToSend.append("latitude", latitude);
    formDataToSend.append("longitude", longitude);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/store-restaurant-data", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      if (response.ok) {
        alert("店舗情報を送信しました！");
        navigate("/MyPage");
      } else {
        alert("申請に失敗しました。");
      }
    } catch (error) {
      console.error("送信エラー:", error);
      alert("送信中にエラーが発生しました。");
    }
  };

  // --- 共通の画像アップローダーUIレンダリング関数 ---
  // file: 現在の画像ファイル, label: ラベル名, onUpload: アップロード時の関数, onRemove: 削除時の関数
  const renderImageUploader = (file, label, onUpload, onRemove) => {
    const previewUrl = file ? URL.createObjectURL(file) : null;

    return (
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>{label}</label>
        
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
            <span style={{ color: "#666" }}>画像がここに表示されます</span>
          )}

          <div style={{ marginTop: "10px" }}>
            {!previewUrl ? (
              <label
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  backgroundColor: "#aaa",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                画像を選択
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) onUpload(e.target.files[0]);
                  }}
                  style={{ display: "none" }}
                />
              </label>
            ) : (
              <div>
                <button
                  onClick={onRemove}
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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) onUpload(e.target.files[0]);
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

      <h2 style={{ textAlign: "center" }}>店舗情報登録</h2>

      {/* トップ画像 (EventFormと同じUI) */}
      {renderImageUploader(
        formData.topimages[0],
        "トップ画像",
        handleTopImageChange,
        handleTopImageRemove
      )}

      {/* 外観・内観画像 (EventFormと同じUIを3つ繰り返し) */}
      {[0, 1, 2].map((i) => (
        <div key={i}>
          {renderImageUploader(
            formData.images[i],
            `外観・内観画像 ${i + 1}`,
            (file) => handleSubImageChange(i, file),
            () => handleSubImageRemove(i)
          )}
        </div>
      ))}

      {/* 基本情報 */}
      {[{ label: "店名", name: "name" }, { label: "見出し", name: "catchphrase" }, { label: "URL", name: "url" }, { label: "電話番号", name: "tel" }].map((field) => (
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

      <div style={{ marginBottom: "10px" }}>
        <label>住所（地図に反映されます）</label>
        <br />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleAddressChange}
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
        />
      </div>

      {/* 地域選択 */}
      <div style={{ marginBottom: "10px" }}>
        <label>地域（1つ選択）</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "5px" }}>
          {areaOptions.map((area) => (
            <label key={area.id} style={{ display: "flex", alignItems: "center" }}>
              <input
                type="radio"
                name="area_id"
                value={area.id}
                checked={formData.area_id === String(area.id)}
                onChange={handleChange}
                style={{ marginRight: "5px" }}
              />
              {area.name}
            </label>
          ))}
        </div>
      </div>

      {/* 営業時間 */}
      <div style={{ marginBottom: "10px" }}>
        <label>営業時間</label>
        <br />
        <input
          type="text"
          name="business_hours"
          value={formData.business_hours}
          onChange={handleChange}
          placeholder="例: 10:00-22:00"
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
        />
      </div>

      {/* 定休日 */}
      <div style={{ marginBottom: "10px" }}>
        <label>定休日</label>
        <br />
        <input
          type="text"
          name="holiday"
          value={formData.holiday}
          onChange={handleChange}
          placeholder="例: 毎週月曜日"
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
        />
      </div>

      {/* 予算選択 */}
      <div style={{ marginBottom: "10px" }}>
        <label>予算（1つ選択）</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "5px" }}>
          {budgetOptions.map((budget) => (
            <label key={budget.id} style={{ display: "flex", alignItems: "center" }}>
              <input
                type="radio"
                name="budget_id"
                value={budget.id}
                checked={formData.budget_id === String(budget.id)}
                onChange={handleChange}
                style={{ marginRight: "5px" }}
              />
              {budget.name}
            </label>
          ))}
        </div>
      </div>

      {/* ジャンル選択 */}
      <div style={{ marginBottom: "10px" }}>
        <label>ジャンル（1つ選択）</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "5px" }}>
          {genreOptions.map((genre) => (
            <label key={genre.id} style={{ display: "flex", alignItems: "center" }}>
              <input
                type="radio"
                name="genre_id"
                value={genre.id}
                checked={formData.genre_id === String(genre.id)}
                onChange={handleChange}
                style={{ marginRight: "5px" }}
              />
              {genre.name}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>コメント欄</label>
        <br />
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          rows={4}
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
        />
      </div>

      <button
        onClick={handleRestaurantSubmit}
        style={{ width: "100%", padding: "12px", backgroundColor: "#a1a5a1ff", color: "white", border: "none" }}
      >
        登録する
      </button>
    </div>
  );
}

export default RestaurantForm;