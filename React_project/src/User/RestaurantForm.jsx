import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function RestaurantForm() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    topimages: [null],
    images: [null, null, null],
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
  });

  const [areaOptions, setAreaOptions] = useState([]);
  const [budgetOptions, setBudgetOptions] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);

  useEffect(() => {
    const fetchMasters = async () => {
      const [areas, budgets, genres] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/m_areas").then((res) => res.json()),
        fetch("http://127.0.0.1:8000/api/m_budgets").then((res) => res.json()),
        fetch("http://127.0.0.1:8000/api/m_genres").then((res) => res.json()),
      ]);
      setAreaOptions(areas);
      setBudgetOptions(budgets);
      setGenreOptions(genres);
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

    const latitude = formData.latitude || "42.4123";
    const longitude = formData.longitude || "141.2063";

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

      {[{ label: "店名", name: "name" }, { label: "見出し", name: "catchphrase" }, { label: "URL", name: "url" }, { label: "電話番号", name: "tel" }].map((field) => (
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
        <label>地域（1つ選択）</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {areaOptions.map((area) => (
            <label key={area.id} style={{ display: "flex", alignItems: "center" }}>
              <input
                type="radio"
                name="area_id"
                value={area.id}
                checked={formData.area_id === String(area.id)}
                onChange={handleChange}
              />
              {area.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label>予算（1つ選択）</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {budgetOptions.map((budget) => (
            <label key={budget.id} style={{ display: "flex", alignItems: "center" }}>
              <input
                type="radio"
                name="budget_id"
                value={budget.id}
                checked={formData.budget_id === String(budget.id)}
                onChange={handleChange}
              />
              {budget.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label>ジャンル（1つ選択）</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {genreOptions.map((genre) => (
            <label key={genre.id} style={{ display: "flex", alignItems: "center" }}>
              <input
                type="radio"
                name="genre_id"
                value={genre.id}
                checked={formData.genre_id === String(genre.id)}
                onChange={handleChange}
              />
              {genre.name}
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