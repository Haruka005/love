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
         console.log("ジオコード結果:", data); // ← ここで確認！
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

  // 緯度・経度が空なら、学校の座標を補完
  const defaultLat = "42.4123"; // 日本工学院北海道専門学校の緯度
  const defaultLon = "141.2063"; // 日本工学院北海道専門学校の経度
  const latitude = formData.latitude || defaultLat;
  const longitude = formData.longitude || defaultLon;

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

  formData.genre_id.forEach((g) => formDataToSend.append("genre_id[]", g));

  Object.entries(formData).forEach(([key, value]) => {
    if (!["topimages", "images", "genre_id", "latitude", "longitude"].includes(key)) {
      formDataToSend.append(key, value);
    }
  });

  // ← ここで補完済みの座標を送信
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
   const handleGenreToggle=(id)=>{
      setFormData((prev)=>({
        ...prev,
        genre_id:prev.genre_id.includes(id)
        ? prev.genre_id.filter((g)=> g != id)
        :[...prev.genre_id,id],
      }));
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

      {[
        { label: "店名", name: "name" },
        { label: "見出し", name: "catchphrase" },
        { label: "URL", name: "url" },
         { label: "電話番号", name: "tel" },
      ].map((field) => (
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
          {areaOptions.map((area) => (
            <option key={area.id} value={area.id}>{area.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>予算</label>
        <select name="budget_id" value={formData.budget_id} onChange={handleChange}>
          <option value="">選択してください</option>
          {budgetOptions.map((budget) => (
            <option key={budget.id} value={budget.id}>{budget.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>ジャンル（複数選択可）</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {genreOptions.map((genre) => (
            <label key={genre.id} style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                value={genre.id}
                checked={formData.genre_id.includes(genre.id)}
                onChange={() => handleGenreToggle(genre.id)}
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