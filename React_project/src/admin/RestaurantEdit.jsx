import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function RestaurantEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    // 管理者モードの判定 (管理者画面からの遷移かどうか)
    const isAdminMode = location.state?.fromAdmin === true;

    // 基本データ
    const [formData, setFormData] = useState({
        name: "",
        catchphrase: "",
        address: "",
        tel: "",
        business_hours: "",
        holiday: "",
        url: "",
        comment: "",
        genre_id: "",
        area_id: "",
        budget_id: "",
        latitude: "",
        longitude: "",
        approval_status_id: ""
    });

    // マスタデータ
    const [areaOptions, setAreaOptions] = useState([]);
    const [budgetOptions, setBudgetOptions] = useState([]);
    const [genreOptions, setGenreOptions] = useState([]);

    // 画像管理
    const [previews, setPreviews] = useState({ topimage: null, image1: null, image2: null, image3: null });
    const [files, setFiles] = useState({ topimage: null, image1: null, image2: null, image3: null });

    const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

    // 取得用URLもモードによって切り替える
    const GET_URL = isAdminMode 
        ? `${API_URL}/api/admin/restaurants/${id}`
        : `${API_URL}/api/restaurants/${id}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = { "Authorization": `Bearer ${token}` };

                // マスタデータと店舗詳細を同時に取得
                const [areas, budgets, genres, shopRes] = await Promise.all([
                    fetch(`${API_URL}/api/m_areas`).then(res => res.json()),
                    fetch(`${API_URL}/api/m_budgets`).then(res => res.json()),
                    fetch(`${API_URL}/api/m_genres`).then(res => res.json()),
                    fetch(GET_URL, { headers })
                ]);

                setAreaOptions(areas);
                setBudgetOptions(budgets);
                setGenreOptions(genres);

                if (shopRes.ok) {
                    const data = await shopRes.json();
                    setFormData({
                        ...data,
                        genre_id: String(data.genre_id || ""),
                        area_id: String(data.area_id || ""),
                        budget_id: String(data.budget_id || ""),
                        approval_status_id: String(data.approval_status_id || ""),
                    });
                    setPreviews({
                        topimage: data.topimage_path,
                        image1: data.image1_path,
                        image2: data.image2_path,
                        image3: data.image3_path
                    });
                } else {
                    alert("データの取得に失敗しました。");
                    navigate(-1);
                }
            } catch (error) {
                console.error("Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, API_URL, GET_URL, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, key) => {
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({ ...prev, [key]: file }));
            setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        const confirmMsg = isAdminMode 
            ? "管理者権限で内容を更新しますか？" 
            : "内容を修正して再申請しますか？\n（※承認されるまで公開している場合は一時的に非公開となります）";
            
        if (!window.confirm(confirmMsg)) return;

        try {
            const token = localStorage.getItem("token");
            const data = new FormData();

            // 基本データの追加
            Object.entries(formData).forEach(([key, val]) => {
                // オブジェクト（リレーションデータ等）を除外して値だけを送る
                if (typeof val !== 'object' || val === null) {
                    data.append(key, val === null ? "" : val);
                }
            });

            // 新規画像があれば追加
            if (files.topimage) data.append("topimage", files.topimage);
            if (files.image1) data.append("image1", files.image1);
            if (files.image2) data.append("image2", files.image2);
            if (files.image3) data.append("image3", files.image3);

            // --- 送信先URLとステータスの切り替え ---
            let SUBMIT_URL;
            if (isAdminMode) {
                SUBMIT_URL = `${API_URL}/api/admin/restaurants/${id}`;
                data.set("approval_status_id", formData.approval_status_id);
            } else {
                SUBMIT_URL = `${API_URL}/api/restaurants/${id}`;
                data.set("approval_status_id", "3"); // 再申請ステータス
                data.set("rejection_reason", ""); // 却下理由をクリア
            }
            
            // LaravelのPUT擬似対応
            data.append("_method", "PUT");

            const response = await fetch(SUBMIT_URL, {
                method: "POST", 
                headers: { 
                    "Authorization": `Bearer ${token}`, 
                    "Accept": "application/json" 
                },
                body: data
            });

            if (response.ok) {
                const successMsg = isAdminMode 
                    ? "更新が完了しました。" 
                    : "再申請が完了しました。管理者の承認をお待ちください。";
                alert(successMsg);
                navigate(-1);
            } else {
                const err = await response.json();
                alert(`更新に失敗しました: ${err.message || "サーバーエラー"}`);
            }
        } catch (error) {
            console.error("Update Error:", error);
            alert("通信エラーが発生しました。");
        }
    };

    if (loading) return <p style={{ padding: "20px" }}>読み込み中...</p>;

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: "center" }}>
                店舗情報の編集 {isAdminMode ? "(管理者モード)" : ""}
            </h2>

            <form onSubmit={handleUpdate}>
                {/* 画像セクション */}
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>トップ画像</label>
                    <div style={imageBoxStyle}>
                        {previews.topimage && <img src={previews.topimage} alt="Top" style={imgPreviewStyle} />}
                        <input type="file" onChange={(e) => handleFileChange(e, 'topimage')} style={fileInputStyle} />
                    </div>
                </div>

                <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ flex: 1 }}>
                            <label style={labelStyle}>画像 {i}</label>
                            <div style={imageBoxStyle}>
                                {previews[`image${i}`] && <img src={previews[`image${i}`]} alt={`Sub${i}`} style={{ ...imgPreviewStyle, height: "60px" }} />}
                                <input type="file" onChange={(e) => handleFileChange(e, `image${i}`)} style={fileInputStyle} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* 基本情報 */}
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>店名</label>
                    <input type="text" name="name" value={formData.name || ""} onChange={handleChange} style={inputStyle} required />
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>見出し</label>
                    <input type="text" name="catchphrase" value={formData.catchphrase || ""} onChange={handleChange} style={inputStyle} />
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>住所</label>
                    <input type="text" name="address" value={formData.address || ""} onChange={handleChange} style={inputStyle} required />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ ...inputGroupStyle, flex: 1 }}>
                        <label style={labelStyle}>営業時間</label>
                        <input type="text" name="business_hours" value={formData.business_hours || ""} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div style={{ ...inputGroupStyle, flex: 1 }}>
                        <label style={labelStyle}>定休日</label>
                        <input type="text" name="holiday" value={formData.holiday || ""} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>電話番号</label>
                    <input type="text" name="tel" value={formData.tel || ""} onChange={handleChange} style={inputStyle} />
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>URL</label>
                    <input type="text" name="url" value={formData.url || ""} onChange={handleChange} style={inputStyle} />
                </div>

                {/* セレクトボックス系 */}
                <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ ...inputGroupStyle, flex: 1 }}>
                        <label style={labelStyle}>地域</label>
                        <select name="area_id" value={formData.area_id} onChange={handleChange} style={inputStyle}>
                            <option value="">選択してください</option>
                            {areaOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                        </select>
                    </div>
                    <div style={{ ...inputGroupStyle, flex: 1 }}>
                        <label style={labelStyle}>ジャンル</label>
                        <select name="genre_id" value={formData.genre_id} onChange={handleChange} style={inputStyle}>
                            <option value="">選択してください</option>
                            {genreOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                        </select>
                    </div>
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>予算</label>
                    <select name="budget_id" value={formData.budget_id} onChange={handleChange} style={inputStyle}>
                        <option value="">選択してください</option>
                        {budgetOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                    </select>
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>詳細説明</label>
                    <textarea name="comment" value={formData.comment || ""} onChange={handleChange} style={{ ...inputStyle, height: "80px" }} />
                </div>

                {/* 管理者専用：ステータス編集 */}
                {isAdminMode && (
                    <div style={inputGroupStyle}>
                        <label style={{ ...labelStyle, color: "#007bff" }}>承認ステータス（管理者のみ）</label>
                        <select name="approval_status_id" value={formData.approval_status_id} onChange={handleChange} style={{ ...inputStyle, borderColor: "#007bff" }}>
                            <option value="0">未承認</option>
                            <option value="1">承認済み</option>
                            <option value="2">却下</option>
                            <option value="3">再申請</option>
                        </select>
                    </div>
                )}

                {/* ボタン */}
                <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
                    <button type="submit" style={isAdminMode ? adminButtonStyle : userButtonStyle}>
                        {isAdminMode ? "変更内容を保存する" : "修正して再申請"}
                    </button>
                    <button type="button" onClick={() => navigate(-1)} style={cancelButtonStyle}>キャンセル</button>
                </div>
            </form>
        </div>
    );
}

// --- Styles ---
const containerStyle = { maxWidth: "600px", margin: "40px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#fff" };
const inputGroupStyle = { marginBottom: "15px" };
const labelStyle = { display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9em" };
const inputStyle = { width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" };
const imageBoxStyle = { textAlign: "center", border: "1px dashed #ccc", padding: "10px", borderRadius: "4px" };
const imgPreviewStyle = { maxWidth: "100%", height: "120px", objectFit: "cover", marginBottom: "10px" };
const fileInputStyle = { fontSize: "0.8em", width: "100%" };
const userButtonStyle = { flex: 2, padding: "12px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" };
const adminButtonStyle = { flex: 2, padding: "12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" };
const cancelButtonStyle = { flex: 1, padding: "12px", backgroundColor: "#f0f0f0", color: "#333", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer" };