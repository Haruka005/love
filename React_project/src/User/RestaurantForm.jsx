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



        const token = localStorage.getItem("usertoken");

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



    // 共通スタイル定義

    const inputStyle = {

        width: "100%",

        padding: "12px 16px",

        fontSize: "16px",

        border: "1.5px solid #ccc",

        borderRadius: "8px",

        outline: "none",

        fontFamily: "Zen Maru Gothic, sans-serif",

        color: "#333",

        boxSizing: "border-box",

        transition: "border-color 0.2s"

    };



    const labelStyle = {

        display: "block",

        marginBottom: "6px",

        fontWeight: "700",

        fontSize: "0.95rem",

        color: "#333",

        textAlign: "left"

    };



    const renderImageUploader = (file, label, onUpload, onRemove, isRequired = false) => {

        const previewUrl = file ? URL.createObjectURL(file) : null;

        return (

            <div style={{ marginBottom: "25px" }}>

                <label style={labelStyle}>

                    {label} {isRequired && <span style={{ color: "#F93D5D" }}>※</span>}

                </label>

                <div style={{

                    width: "100%",

                    border: "2px dashed #ccc",

                    borderRadius: "15px",

                    padding: "20px",

                    backgroundColor: "#fafafa",

                    boxSizing: "border-box"

                }}>

                    {previewUrl ? (

                        <div>

                            <img src={previewUrl} alt="preview" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "10px", display: "block", margin: "0 auto" }} />

                            <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "10px" }}>

                                <button onClick={onRemove} style={{ padding: "8px 18px", border: "1px solid #ccc", backgroundColor: "#fff", borderRadius: "20px", cursor: "pointer", fontSize: "0.8rem", color: "#333" }}>削除</button>

                                <label style={{ padding: "8px 18px", backgroundColor: "#333", color: "white", borderRadius: "20px", cursor: "pointer", fontSize: "0.8rem", border: "1px solid #333" }}>

                                    変更

                                    <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files[0])} style={{ display: "none" }} />

                                </label>

                            </div>

                        </div>

                    ) : (

                        <label style={{ cursor: "pointer", display: "block", padding: "20px 0" }}>

                            <div style={{ color: "#333", fontSize: "0.9rem", fontWeight: "700", marginBottom: "10px" }}>画像をアップロード</div>

                            <span style={{ display: "inline-block", padding: "8px 20px", backgroundColor: "#fff", color: "#333", borderRadius: "20px", border: "1.5px solid #ccc", fontSize: "0.85rem" }}>ファイルを選択</span>

                            <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files[0])} style={{ display: "none" }} />

                        </label>

                    )}

                </div>

            </div>

        );

    };



    return (

        <div style={{ 

            position: "relative", 

            padding: "50px 20px", 

            maxWidth: "550px", 

            margin: "30px auto",

            backgroundColor: "#fff",

            borderRadius: "20px",

            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",

            textAlign: "center"

        }}>

            {/* 戻るボタン */}

            <button

                onClick={() => navigate("/MyPage")}

                style={{

                    position: "absolute",

                    top: "15px",

                    left: "15px",

                    width: "40px",

                    height: "40px",

                    borderRadius: "50%",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    fontSize: "20px",

                    border: "1px solid #ccc",

                    backgroundColor: "#fff",

                    color: "#333",

                    cursor: "pointer",

                    transition: "0.2s"

                }}

                onMouseOver={(e) => {

                    e.currentTarget.style.backgroundColor = "#333";

                    e.currentTarget.style.color = "#fff";

                    e.currentTarget.style.borderColor = "#333";

                }}

                onMouseOut={(e) => {

                    e.currentTarget.style.backgroundColor = "#fff";

                    e.currentTarget.style.color = "#333";

                    e.currentTarget.style.borderColor = "#ccc";

                }}

            >

                ✕

            </button>



            <h2 style={{ color: "#333", marginBottom: "30px", fontSize: "1.8rem", fontWeight: "700" }}>店舗情報登録</h2>



            {/* ガイドメッセージ */}

            <div style={{

                backgroundColor: "#fffafb",

                borderLeft: "4px solid #F93D5D",

                color: "#555",

                padding: "12px 15px",

                borderRadius: "4px",

                marginBottom: "25px",

                fontSize: "0.85rem",

                lineHeight: "1.6",

                textAlign: "left"

            }}>

                <strong>【入力について】</strong><br />

                <span style={{ color: "#F93D5D" }}>※</span> は必須項目です。画像は<strong>5MB以下</strong>でアップロードしてください。

            </div>



            {/* 画像エリア */}

            {renderImageUploader(formData.topimages[0], "トップ画像", handleTopImageChange, handleTopImageRemove, true)}

            {renderImageUploader(formData.images[0], "外観画像・内観画像・メニュー画像", (file) => handleSubImageChange(0, file), () => handleSubImageRemove(0))}

            {renderImageUploader(formData.images[1], "外観画像・内観画像・メニュー画像", (file) => handleSubImageChange(1, file), () => handleSubImageRemove(1))}

            {renderImageUploader(formData.images[2], "外観画像・内観画像・メニュー画像", (file) => handleSubImageChange(2, file), () => handleSubImageRemove(2))}



            {/* 入力項目 */}

            <div style={{ marginBottom: "20px" }}>

                <label style={labelStyle}>店名 <span style={{ color: "#F93D5D" }}>※</span></label>

                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="例：〇〇レストラン" style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#333"} onBlur={(e) => e.target.style.borderColor = "#ccc"} />

            </div>



            <div style={{ marginBottom: "20px" }}>

                <label style={labelStyle}>見出し <span style={{ color: "#F93D5D" }}>※</span></label>

                <input type="text" name="catchphrase" value={formData.catchphrase} onChange={handleChange} placeholder="例：絶品ハンバーグが自慢のお店" style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#333"} onBlur={(e) => e.target.style.borderColor = "#ccc"} />

            </div>



            <div style={{ marginBottom: "20px" }}>

                <label style={labelStyle}>住所 <span style={{ color: "#F93D5D" }}>※</span></label>

                <input type="text" name="address" value={formData.address} onChange={handleAddressChange} placeholder="例：北海道室蘭市〇〇町1-2-3" style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#333"} onBlur={(e) => e.target.style.borderColor = "#ccc"} />

            </div>



            <div style={{ marginBottom: "20px" }}>

                <label style={labelStyle}>地域（1つ選択） <span style={{ color: "#F93D5D" }}>※</span></label>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "10px", justifyContent: "flex-start" }}>

                    {areaOptions.map((area) => (

                        <label key={area.id} style={{ display: "flex", alignItems: "center", cursor: "pointer", fontSize: "0.9rem" }}>

                            <input type="radio" name="area_id" value={area.id} checked={formData.area_id === String(area.id)} onChange={handleChange} style={{ marginRight: "6px" }} />

                            {area.name}

                        </label>

                    ))}

                </div>

            </div>



            <div style={{ marginBottom: "20px" }}>

                <label style={labelStyle}>営業時間 <span style={{ color: "#F93D5D" }}>※</span></label>

                <input type="text" name="business_hours" value={formData.business_hours} onChange={handleChange} placeholder="例：10:00～22:00" style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#333"} onBlur={(e) => e.target.style.borderColor = "#ccc"} />

            </div>



            <div style={{ marginBottom: "20px" }}>

                <label style={labelStyle}>定休日 <span style={{ color: "#F93D5D" }}>※</span></label>

                <input type="text" name="holiday" value={formData.holiday} onChange={handleChange} placeholder="例：毎週月曜日" style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#333"} onBlur={(e) => e.target.style.borderColor = "#ccc"} />

            </div>



            <div style={{ marginBottom: "20px" }}>

                <label style={labelStyle}>電話番号 <span style={{ color: "#F93D5D" }}>※</span></label>

                <input type="text" name="tel" value={formData.tel} onChange={handleChange} placeholder="例：090-1234-5678" style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#333"} onBlur={(e) => e.target.style.borderColor = "#ccc"} />

            </div>



            <div style={{ marginBottom: "20px" }}>

                <label style={labelStyle}>URL（ない場合は「なし」と記入）</label>

                <input type="text" name="url" value={formData.url} onChange={handleChange} placeholder="例：https://example.com" style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#333"} onBlur={(e) => e.target.style.borderColor = "#ccc"} />

            </div>



            <div style={{ marginBottom: "20px" }}>

                <label style={labelStyle}>予算 <span style={{ color: "#F93D5D" }}>※</span></label>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "10px", justifyContent: "flex-start" }}>

                    {budgetOptions.map((budget) => (

                        <label key={budget.id} style={{ display: "flex", alignItems: "center", cursor: "pointer", fontSize: "0.9rem" }}>

                            <input type="radio" name="budget_id" value={budget.id} checked={formData.budget_id === String(budget.id)} onChange={handleChange} style={{ marginRight: "6px" }} />

                            {budget.name}

                        </label>

                    ))}

                </div>

            </div>



            <div style={{ marginBottom: "20px" }}>

                <label style={labelStyle}>ジャンル <span style={{ color: "#F93D5D" }}>※</span></label>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "10px", justifyContent: "flex-start" }}>

                    {genreOptions.map((genre) => (

                        <label key={genre.id} style={{ display: "flex", alignItems: "center", cursor: "pointer", fontSize: "0.9rem" }}>

                            <input type="radio" name="genre_id" value={genre.id} checked={formData.genre_id === String(genre.id)} onChange={handleChange} style={{ marginRight: "6px" }} />

                            {genre.name}

                        </label>

                    ))}

                </div>

            </div>



            <div style={{ marginBottom: "30px" }}>

                <label style={labelStyle}>詳細</label>

                <textarea name="comment" value={formData.comment} onChange={handleChange} rows={4} placeholder="任意入力です" style={{ ...inputStyle, resize: "none" }} onFocus={(e) => e.target.style.borderColor = "#333"} onBlur={(e) => e.target.style.borderColor = "#ccc"} />

            </div>



            {/* 申請ボタン */}

            <button 

                onClick={handleRestaurantSubmit} 

                style={{ 

                    width: "100%", 

                    padding: "16px", 

                    backgroundColor: "#F93D5D", 

                    color: "white", 

                    border: "none", 

                    borderRadius: "12px", 

                    cursor: "pointer", 

                    fontWeight: "bold",

                    fontSize: "1.2rem", 

                    transition: "all 0.3s ease",

                    boxShadow: "0 4px 10px rgba(249, 61, 93, 0.3)",

                    marginBottom: "20px"

                }}

                onMouseOver={(e) => {

                    e.currentTarget.style.backgroundColor = "#e03652";

                    e.currentTarget.style.transform = "translateY(-1px)";

                }}

                onMouseOut={(e) => {

                    e.currentTarget.style.backgroundColor = "#F93D5D";

                    e.currentTarget.style.transform = "translateY(0)";

                }}

            >

                申請を送信する

            </button>

        </div>

    );

}



export default RestaurantForm;