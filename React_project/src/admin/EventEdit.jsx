import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

// APIのベースURLを環境変数から取得し、末尾の /api を適切に処理する関数
const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    // すでに末尾が /api で終わっている場合はそのまま、そうでなければ /api を付与
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

const API_BASE = getBaseApiUrl();

export default function EventEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); 
    
    const [loading, setLoading] = useState(true);

    // 管理者モードの判定 (Location state経由)
    const isAdminMode = location.state?.fromAdmin === true;

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
        approval_status_id: "" 
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    // 修正ポイント：API_BASEを使用してURLの重複を防ぐ
    const GET_URL = isAdminMode 
        ? `${API_BASE}/admin/events/${id}`
        : `${API_BASE}/events/${id}`;

    const fetchEvent = useCallback(async () => {
        const token = isAdminMode
         ? localStorage.getItem("adminToken")
         : localStorage.getItem("userToken");

        
        // 認証チェック：トークンがない場合は即リダイレクト
        if (!token) {
            console.error("トークンがありません。");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(GET_URL, {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            // 認証チェック：トークンが無効（401）な場合
           if (response.status === 401) {
                alert("ログインの有効期限が切れました。再度ログインしてください。");

                if (isAdminMode) {
                    localStorage.removeItem("adminToken");
                    navigate("/admin/login");
                } else {
                    localStorage.removeItem("userToken");
                    navigate("/login");
                }
                return;
            }


            if (response.ok) {
                const data = await response.json();
                
                // 日時フォーマットの調整 (input type="datetime-local"用)
                if (data.start_date) data.start_date = data.start_date.replace(' ', 'T').slice(0, 16);
                if (data.end_date) data.end_date = data.end_date.replace(' ', 'T').slice(0, 16);
                
                setFormData(data);
                if (data.image_path) setPreviewUrl(data.image_path);
            } else {
                alert("データの取得に失敗しました。");
                navigate(-1);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            alert("通信エラーが発生しました。");
        } finally {
            setLoading(false);
        }
    }, [id, GET_URL, navigate]);

    useEffect(() => {
        fetchEvent();
    }, [fetchEvent]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const confirmMsg = isAdminMode 
            ? "管理者権限で内容を更新しますか？" 
            : "内容を修正して再申請しますか？\n（※承認されるまで公開している場合は一時的に非公開となります）";
            
        if (!window.confirm(confirmMsg)) return;

        try {
           const token = isAdminMode
                ? localStorage.getItem("adminToken")
                : localStorage.getItem("userToken");
            
            if (!token) {
                if (isAdminMode) {
                    navigate("/admin/login");
                } else {
                    navigate("/login");
                }
                return;
            }


            const data = new FormData();
            
            // 既存データのセット
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value === null ? "" : value);
            });

            if (imageFile) {
                data.append("image", imageFile);
            }

            // 送信先URLの構築
            let SUBMIT_URL = isAdminMode 
                ? `${API_BASE}/admin/events/${id}`
                : `${API_BASE}/events/${id}`;

            if (isAdminMode) {
                data.set("approval_status_id", formData.approval_status_id);
            } else {
                // 一般ユーザーの再申請時はステータスを「3（再申請）」にする
                data.set("approval_status_id", "3"); 
                data.set("rejection_reason", ""); 
            }

            // Laravelの擬似PUT対応
            data.append("_method", "PUT");

            const response = await fetch(SUBMIT_URL, {
                method: "POST", 
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
                body: data
            });

            if (response.status === 401) {
                alert("認証エラーです。再ログインしてください。");
                navigate("/login");
                return;
            }

            if (response.ok) {
                const successMsg = isAdminMode 
                    ? "更新が完了しました。" 
                    : "再申請が完了しました。承認されるまで一時的に非公開となります。";
                
                alert(successMsg);
                navigate(-1);
            } else {
                const errRes = await response.json();
                alert(`更新に失敗しました: ${errRes.message || "サーバーエラー"}`);
            }
        } catch (error) {
            console.error("Update Error:", error);
            alert("通信エラーが発生しました。");
        }
    };

    if (loading) return <p style={{ padding: "20px" }}>読み込み中...</p>;

    return (
        <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#fff" }}>
            <h2 style={{ textAlign: "center" }}>
                イベント情報の編集 {isAdminMode ? "(管理者モード)" : ""}
            </h2>
            
            <form onSubmit={handleSubmit}>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>見出し画像</label>
                    <div style={{ textAlign: "center", border: "1px dashed #ccc", padding: "10px", borderRadius: "4px" }}>
                        {previewUrl && <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%", height: "150px", objectFit: "cover", marginBottom: "10px" }} />}
                        <input type="file" onChange={handleImageChange} style={{ fontSize: "0.8em", width: "100%" }} />
                    </div>
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>イベント名</label>
                    <input type="text" name="name" value={formData.name || ""} onChange={handleChange} style={inputStyle} required />
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>見出し（キャッチコピー）</label>
                    <input type="text" name="catchphrase" value={formData.catchphrase || ""} onChange={handleChange} style={inputStyle} />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ ...inputGroupStyle, flex: 1 }}>
                        <label style={labelStyle}>開始日時</label>
                        <input type="datetime-local" name="start_date" value={formData.start_date || ""} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div style={{ ...inputGroupStyle, flex: 1 }}>
                        <label style={labelStyle}>終了日時</label>
                        <input type="datetime-local" name="end_date" value={formData.end_date || ""} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>場所</label>
                    <input type="text" name="location" value={formData.location || ""} onChange={handleChange} style={inputStyle} />
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>主催者</label>
                    <input type="text" name="organizer" value={formData.organizer || ""} onChange={handleChange} style={inputStyle} />
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>公式サイトURL</label>
                    <input type="text" name="url" value={formData.url || ""} onChange={handleChange} style={inputStyle} />
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>予約区分</label>
                    <select name="is_free_participation" value={formData.is_free_participation} onChange={handleChange} style={inputStyle}>
                        <option value="">選択してください</option>
                        <option value="0">要予約</option>
                        <option value="1">自由参加</option>
                    </select>
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>詳細説明</label>
                    <textarea name="description" value={formData.description || ""} onChange={handleChange} style={{ ...inputStyle, height: "80px" }} />
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>注意事項</label>
                    <textarea name="notes" value={formData.notes || ""} onChange={handleChange} style={{ ...inputStyle, height: "60px" }} />
                </div>

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
const inputGroupStyle = { marginBottom: "15px" };
const labelStyle = { display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9em" };
const inputStyle = { width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" };
const userButtonStyle = { flex: 2, padding: "12px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" };
const adminButtonStyle = { flex: 2, padding: "12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" };
const cancelButtonStyle = { flex: 1, padding: "12px", backgroundColor: "#f0f0f0", color: "#333", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer" };