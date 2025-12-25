// src/User/RestaurantForm.jsx
import React, { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

// APIのベースURL
const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

const API_BASE = getBaseApiUrl();
// ★各画像 5MB制限
const MAX_SIZE_MB = 5;

function RestaurantForm() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        topimages: [null], // トップ画像
        images: [null, null, null], // 外観・内観・メニュー画像
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

    const fetchMasters = useCallback(async () => {
        try {
            const [areas, budgets, genres] = await Promise.all([
                fetch(`${API_BASE}/m_areas`).then((res) => res.ok ? res.json() : []),
                fetch(`${API_BASE}/m_budgets`).then((res) => res.ok ? res.json() : []),
                fetch(`${API_BASE}/m_genres`).then((res) => res.ok ? res.json() : []),
            ]);
            setAreaOptions(areas);
            setBudgetOptions(budgets);
            setGenreOptions(genres);
        } catch (error) {
            console.error("マスタデータの取得に失敗しました", error);
        }
    }, []);

    useEffect(() => { fetchMasters(); }, [fetchMasters]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = async (e) => {
        const address = e.target.value;
        setFormData((prev) => ({ ...prev, address }));
        if (address.length > 3) {
            try {
                const res = await fetch(`${API_BASE}/geocode?q=${encodeURIComponent(address)}`);
                const data = await res.json();
                if (data.length > 0) {
                    const { lat, lon } = data[0];
                    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lon }));
                }
            } catch (error) {
                console.error("位置情報取得失敗:", error);
            }
        }
    };

    // 画像サイズバリデーション
    const validateSize = (file) => {
        if (file && file.size > MAX_SIZE_MB * 1024 * 1024) {
            alert(`5MBを超える画像はアップロードできません。`);
            return false;
        }
        return true;
    };

    const handleTopImageChange = (file) => {
        if (!validateSize(file)) return;
        setFormData((prev) => ({ ...prev, topimages: [file] }));
    };

    const handleTopImageRemove = () => {
        setFormData((prev) => ({ ...prev, topimages: [null] }));
    };

    const handleSubImageChange = (index, file) => {
        if (!validateSize(file)) return;
        const newImages = [...formData.images];
        newImages[index] = file;
        setFormData((prev) => ({ ...prev, images: newImages }));
    };

    const handleSubImageRemove = (index) => {
        const newImages = [...formData.images];
        newImages[index] = null;
        setFormData((prev) => ({ ...prev, images: newImages }));
    };

    const handleRestaurantSubmit = async () => {
        if (!user?.id) { alert("ログインしてください"); return; }
        if (!formData.topimages[0]) { alert("トップ画像は必須です"); return; }

        const requiredFields = {
            name: "店名",
            catchphrase: "見出し",
            tel: "電話番号",
            address: "住所",
            area_id: "地域",
            business_hours: "営業時間",
            holiday: "定休日",
            budget_id: "予算",
            genre_id: "ジャンル",
        };

        for (const [key, label] of Object.entries(requiredFields)) {
            if (!formData[key]) { alert(`${label}を入力してください`); return; }
        }

        const formDataToSend = new FormData();
        formDataToSend.append("user_id", user.id);
        formDataToSend.append("topimages[]", formData.topimages[0]);
        formData.images.forEach((img) => { if (img) formDataToSend.append("images[]", img); });

        Object.entries(formData).forEach(([key, value]) => {
            if (!["topimages", "images"].includes(key)) {
                formDataToSend.append(key, value || "");
            }
        });

        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${API_BASE}/store-restaurant-data`, {
                method: "POST",
                body: formDataToSend,
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
            });
            if (response.ok) {
                alert("店舗情報を送信しました！");
                navigate("/MyPage");
            } else {
                alert("送信に失敗しました。");
            }
        } catch (error) {
            alert("エラーが発生しました。");
        }
    };

    const renderImageUploader = (file, label, onUpload, onRemove, isRequired = false) => {
        const previewUrl = file ? URL.createObjectURL(file) : null;
        return (
            <div style={{ marginBottom: "20px" }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                    {label} {isRequired && <span style={{ color: "red" }}>※</span>}
                </label>
                <div style={{ width: "100%", textAlign: "center", border: "1px solid #ccc", borderRadius: "8px", padding: "10px", backgroundColor: "#f9f9f9" }}>
                    {previewUrl ? (
                        <img src={previewUrl} alt="preview" style={{ maxWidth: "100%", height: "150px", objectFit: "cover", borderRadius: "6px" }} />
                    ) : (
                        <div style={{ height: "150px", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>画像未選択</div>
                    )}
                    <div style={{ marginTop: "10px" }}>
                        {!previewUrl ? (
                            <label style={{ display: "inline-block", padding: "6px 12px", backgroundColor: "#aaa", color: "white", borderRadius: "5px", cursor: "pointer" }}>
                                画像を選択
                                <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files[0])} style={{ display: "none" }} />
                            </label>
                        ) : (
                            <div>
                                <button onClick={onRemove} style={{ padding: "8px 16px", backgroundColor: "#aaa", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "10px" }}>削除</button>
                                <label style={{ display: "inline-block", padding: "8px 16px", backgroundColor: "#aaa", color: "white", borderRadius: "5px", cursor: "pointer" }}>
                                    変更
                                    <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files[0])} style={{ display: "none" }} />
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
            <button onClick={() => navigate("/MyPage")} style={{ position: "absolute", top: "10px", left: "10px", backgroundColor: "#eee", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px", cursor: "pointer" }}>✕</button>
            <h2 style={{ textAlign: "center" }}>店舗情報登録</h2>

            <div style={{ backgroundColor: "#fff3cd", border: "1px solid #ffeeba", color: "#856404", padding: "10px", borderRadius: "5px", marginBottom: "20px", fontSize: "0.9rem", lineHeight: "1.5" }}>
                <strong>【入力について】</strong><br />
                <span style={{ color: "red" }}>※</span> がついている項目はすべて必須です。<br />
                画像は<strong>5MB以下</strong>でアップロードしてください。
            </div>

            {/* 画像エリア：続けて表示 */}
            {renderImageUploader(formData.topimages[0], "トップ画像", handleTopImageChange, handleTopImageRemove, true)}
            {renderImageUploader(formData.images[0], "外観画像", (file) => handleSubImageChange(0, file), () => handleSubImageRemove(0))}
            {renderImageUploader(formData.images[1], "内観画像", (file) => handleSubImageChange(1, file), () => handleSubImageRemove(1))}
            {renderImageUploader(formData.images[2], "メニュー画像", (file) => handleSubImageChange(2, file), () => handleSubImageRemove(2))}

            {/* 入力項目：順序維持 */}
            <div style={{ marginBottom: "10px" }}>
                <label>店名 <span style={{ color: "red" }}>※</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="例：〇〇レストラン" style={{ width: "100%", padding: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>

            {/* キャッチコピー追加 */}
            <div style={{ marginBottom: "10px" }}>
                <label>見出し <span style={{ color: "red" }}>※</span></label>
                <input type="text" name="catchphrase" value={formData.catchphrase} onChange={handleChange} placeholder="例：絶品ハンバーグが自慢のお店" style={{ width: "100%", padding: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>住所 <span style={{ color: "red" }}>※</span></label>
                <input type="text" name="address" value={formData.address} onChange={handleAddressChange} placeholder="例：北海道室蘭市〇〇町1-2-3" style={{ width: "100%", padding: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>地域（1つ選択） <span style={{ color: "red" }}>※</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "5px" }}>
                    {areaOptions.map((area) => (
                        <label key={area.id} style={{ display: "flex", alignItems: "center" }}>
                            <input type="radio" name="area_id" value={area.id} checked={formData.area_id === String(area.id)} onChange={handleChange} style={{ marginRight: "5px" }} />
                            {area.name}
                        </label>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>営業時間 <span style={{ color: "red" }}>※</span></label>
                <input type="text" name="business_hours" value={formData.business_hours} onChange={handleChange} placeholder="例：10:00～22:00" style={{ width: "100%", padding: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>定休日 <span style={{ color: "red" }}>※</span></label>
                <input type="text" name="holiday" value={formData.holiday} onChange={handleChange} placeholder="例：毎週月曜日" style={{ width: "100%", padding: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>電話番号 <span style={{ color: "red" }}>※</span></label>
                <input type="text" name="tel" value={formData.tel} onChange={handleChange} placeholder="例：090-1234-5678" style={{ width: "100%", padding: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>URL（ない場合は「なし」）</label>
                <input type="text" name="url" value={formData.url} onChange={handleChange} placeholder="例：https://example.com" style={{ width: "100%", padding: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>予算 <span style={{ color: "red" }}>※</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "5px" }}>
                    {budgetOptions.map((budget) => (
                        <label key={budget.id} style={{ display: "flex", alignItems: "center" }}>
                            <input type="radio" name="budget_id" value={budget.id} checked={formData.budget_id === String(budget.id)} onChange={handleChange} style={{ marginRight: "5px" }} />
                            {budget.name}
                        </label>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>ジャンル <span style={{ color: "red" }}>※</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "5px" }}>
                    {genreOptions.map((genre) => (
                        <label key={genre.id} style={{ display: "flex", alignItems: "center" }}>
                            <input type="radio" name="genre_id" value={genre.id} checked={formData.genre_id === String(genre.id)} onChange={handleChange} style={{ marginRight: "5px" }} />
                            {genre.name}
                        </label>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <label>詳細</label>
                <textarea name="comment" value={formData.comment} onChange={handleChange} rows={4} placeholder="任意入力です" style={{ width: "100%", padding: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>

            {/* 申請ボタン（鬼ピンク） */}
            <button 
                onClick={handleRestaurantSubmit} 
                style={{ 
                    width: "100%", padding: "16px", backgroundColor: "#FF4D79", color: "white", 
                    border: "none", borderRadius: "30px", cursor: "pointer", fontWeight: "bold",
                    fontSize: "18px", boxShadow: "0 4px 12px rgba(255, 77, 121, 0.4)", marginBottom: "40px"
                }}
            >
                申請する
            </button>
        </div>
    );
}

export default RestaurantForm;