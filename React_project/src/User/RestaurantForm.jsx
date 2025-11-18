import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./components/AuthContext";
import MapView from "./MapView";

function RestaurantForm() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    topimages: [null],
    images: [null, null, null],
    name: "",
    headline: "",
    url: "",
    comment: "",
    budget_id: "",
    address: "",
    latitude: "",
    longitude: "",
    genre_id: [],
    area_id: "",
  });

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
        }
      } catch (error) {
        console.error("位置情報取得失敗:", error);
      }
    }
  };

  const handleTopImageChange = (index, file) => {
    const newTopImages = [...formData.topimages];
    newTopImages[index] = file;
    setFormData((prev) => ({ ...prev, topimages: newTopImages }));
  };

  const handleImageChange = (index, file) => {
    const newImages = [...formData.images];
    newImages[index] = file;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleRestaurantSubmit = async () => {
    if (!currentUser?.id) {
      alert("ログインしてください");
      navigate("/login");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("user_id", currentUser.id);

    if (formData.topimages[0]) {
      formDataToSend.append("topimages[]", formData.topimages[0]);
    }

    formData.images.forEach((img) => {
      if (img) {
        formDataToSend.append("images[]", img);
      }
    });

    if (formData.genre_id.length > 0) {
      formData.genre_id.forEach((g) => formDataToSend.append("genre_id[]", g));
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (!["topimages", "images", "genre_id"].includes(key)) {
        formDataToSend.append(key, value);
      }
    });

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
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <button onClick={() => navigate("/MyPage")} style={{ position: "absolute", top: "10px", left: "10px" }}>✕</button>
      <h2 style={{ textAlign: "center" }}>店舗情報登録</h2>

      <div style={{ height: "150px", backgroundColor: "#ddd", marginBottom: "10px" }}>
        {formData.topimages[0] ? (
          <img src={URL.createObjectURL(formData.topimages[0])} alt="トップ画像" style={{ maxWidth: "100%", maxHeight: "100%" }} />
        ) : (
          <span>トップ画像（仮）</span>
        )}
      </div>

      <input type="file" onChange={(e) => handleTopImageChange(0, e.target.files[0])} />

      <div>
        <label>外観・内観画像（最大3枚）</label>
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <input type="file" accept="image/*" onChange={(e) => handleImageChange(i, e.target.files[0])} />
            {formData.images[i] && (
              <img src={URL.createObjectURL(formData.images[i])} alt={`画像${i + 1}`} style={{ width: "100%", maxHeight: "300px" }} />
            )}
          </div>
        ))}
      </div>

      <div>
        <label>アクセス</label>
        <MapView address={formData.address} />
      </div>

      {[{ label: "店名", name: "name" }, { label: "見出し", name: "headline" }, { label: "URL", name: "url" }].map((field) => (
        <div key={field.name}>
          <label>{field.label}</label>
          <input type="text" name={field.name} value={formData[field.name]} onChange={handleChange} />
        </div>
      ))}

      <div>
        <label>住所（地図に反映されます）</label>
        <input type="text" name="address" value={formData.address} onChange={handleAddressChange} />
      </div>

      <div>
        <label>地域</label>
        <select name="area_id" value={formData.area_id} onChange={handleChange}>
          <option value="">選択してください</option>
          <option value="登別">登別</option>
          <option value="室蘭">室蘭</option>
        </select>
      </div>

      <div>
        <label>予算</label>
        <select name="budget_id" value={formData.budget_id} onChange={handleChange}>
          <option value="">選択してください</option>
          <option value="1000">~1000円</option>
          <option value="3000">~3000円</option>
          <option value="5000">~5000円</option>
          <option value="5001">5000円以上</option>
        </select>
      </div>

      <div>
        <label>ジャンル（複数選択可）</label>
        <div>
          {["洋食", "定食", "デザート"].map((genre) => (
            <label key={genre}>
              <input
                type="checkbox"
                value={genre}
                checked={formData.genre_id.includes(genre)}
                onChange={(e) => {
                  const { checked, value } = e.target;
                  setFormData((prev) => ({
                    ...prev,
                    genre_id: checked
                      ? [...prev.genre_id, value]
                      : prev.genre_id.filter((g) => g !== value),
                  }));
                }}
              />
              <span>{genre}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label>コメント欄</label>
        <textarea name="comment" value={formData.comment} onChange={handleChange} rows={4} />
      </div>

      <button onClick={handleRestaurantSubmit}>登録する</button>
    </div>
  );
}

export default RestaurantForm;