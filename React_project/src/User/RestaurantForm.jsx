// src/User/RestaurantForm.jsx
import React, { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

// APIのベースURLを調整（末尾の /api 重複を防止する共通ロジック）
const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

const API_BASE = getBaseApiUrl();
const MAX_SIZE_MB = 5;

function RestaurantForm() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        topimages: [null], // トップ画像
        images: [null, null, null], // 外観・内観画像
        name: "",
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

    // マスタデータの取得
    const fetchMasters = useCallback(async () => {
        try {
            // Promise.all 内の fetch URL も API_BASE を使用
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

    useEffect(() => {
        fetchMasters();
    }, [fetchMasters]);

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

    // 画像処理ハンドラ
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

    const handleRestaurantSubmit = async () => {
        if (!user?.id) {
            alert("ログインしてください");
            navigate("/login");
            return;
        }

        // バリデーション
        if (!formData.topimages[0]) {
            alert("トップ画像を設定してください。");
            return;
        }

        const requiredFields = {
            name: "店名",
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
        formDataToSend.append("user_id", user.id);

        if (formData.topimages[0]) {
            formDataToSend.append("topimages[]", formData.topimages[0]);
        }
        formData.images.forEach((img) => {
            if (img) formDataToSend.append("images[]", img);
        });

        formDataToSend.append("genre_id", formData.genre_id);
        formDataToSend.append("area_id", formData.area_id);
        formDataToSend.append("budget_id", formData.budget_id);
        formDataToSend.append("latitude", formData.latitude || "42.4123");
        formDataToSend.append("longitude", formData.longitude || "141.2063");

        Object.entries(formData).forEach(([key, value]) => {
            if (!["topimages", "images", "genre_id", "area_id", "budget_id", "latitude", "longitude"].includes(key)) {
                formDataToSend.append(key, value);
            }
        });

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${API_BASE}/store-restaurant-data`, {
                method: "POST",
                body: formDataToSend,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            });

            if (response.ok) {
                alert("店舗情報を送信しました！管理者による承認後に掲載されます。");
                navigate("/MyPage");
            } else if (response.status === 422) {
                const errorData = await response.json();
                let errorMessage = "入力内容に不備があります。\n\n";
                if (errorData.errors) {
                    Object.values(errorData.errors).forEach(messages => {
                        messages.forEach(msg => { errorMessage += `・${msg}\n`; });
                    });
                }
                alert(errorMessage);
            } else {
                alert(`申請に失敗しました。ステータスコード: ${response.status}`);
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
                該当しない項目は<strong>「なし」</strong>と記入してください。<br />
                画像は<strong>5MB以下</strong>でアップロードしてください。
            </div>

            {renderImageUploader(formData.topimages[0], "トップ画像", handleTopImageChange, handleTopImageRemove, true)}

            {[0, 1, 2].map((i) => (
                <div key={i}>
                    {renderImageUploader(formData.images[i], `外観・内観・メニュー画像 ${i + 1}`, (file) => handleSubImageChange(i, file), () => handleSubImageRemove(i), false)}
                </div>
            ))}

            <div style={{ marginBottom: "10px" }}>
                <label>店名 <span style={{ color: "red" }}>※</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="例：〇〇レストラン" style={{ width: "100%", padding: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
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
                <label>予算（1つ選択） <span style={{ color: "red" }}>※</span></label>
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
                <label>ジャンル（1つ選択） <span style={{ color: "red" }}>※</span></label>
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

            <button onClick={handleRestaurantSubmit} style={{ width: "100%", padding: "12px", backgroundColor: "#a1a5a1ff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                申請する
            </button>
        </div>
    );
}

export default RestaurantForm;