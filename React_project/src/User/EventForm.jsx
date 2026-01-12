import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.js";

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

const API_BASE = getBaseApiUrl();

function EventForm() {
    const [previewUrl, setPreviewUrl] = useState(null);
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
    });

    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    
    if (!context) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "#F93D5D" }}>
                <p>ログイン情報が取得できません。ログインしてください。</p>
            </div>
        );
    }
    const { user } = context;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > MAX_SIZE_BYTES) {
            alert(`ファイルサイズが大きすぎます。${MAX_SIZE_MB}MB以下の画像を選択してください。`);
            e.target.value = "";
            return;
        }
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleImageRemove = () => {
        setImageFile(null);
        setPreviewUrl(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEventSubmit = async () => {
        if (!user?.id) {
            alert("ログインしてください");
            navigate("/login");
            return;
        }
        if (!imageFile) {
            alert("見出し画像を設定してください。");
            return;
        }

        const fieldLabels = {
            name: "イベント名",
            catchphrase: "見出し",
            start_date: "開始日",
            end_date: "終了日",
            location: "場所",
            url: "URL",
            organizer: "主催者",
            is_free_participation: "予約",
        };

        for (const [key, label] of Object.entries(fieldLabels)) {
            if (!formData[key] || String(formData[key]).trim() === "") {
                alert(`${label}を入力してください。\n該当しない場合は「なし」と記入してください。`);
                return;
            }
        }

        const start = new Date(formData.start_date);
        const end = new Date(formData.end_date);
        if (start >= end) {
            alert("終了日は開始日より後に設定してください。");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("user_id", user.id);
        formDataToSend.append("image", imageFile);
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        const token = localStorage.getItem("usertoken");

        try {
            const response = await fetch(`${API_BASE}/store-event-data`, {
                method: "POST",
                body: formDataToSend,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            });

            if (response.ok) {
                alert("イベント申請が完了しました！\n管理者による承認後に掲載されます。");
                navigate("/EventApplicationHistory");
            } else if (response.status === 401) {
                alert("セッションが切れました。再度ログインしてください。");
                navigate("/login");
            } else if (response.status === 404) {
                alert("送信先のURLが見つかりませんでした(404)。管理者に連絡してください。");
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(`申請に失敗しました: ${errorData.message || "内容を確認してください。"}`);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("サーバーとの通信に失敗しました。ネットワーク状況を確認してください。");
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

            <h2 style={{ color: "#333", marginBottom: "30px", fontSize: "1.8rem", fontWeight: "700" }}>イベント申請</h2>

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
                <strong>【入力について】</strong><br/>
                <span style={{color: "#F93D5D"}}>※</span> は必須項目です。該当なしは「なし」と記入してください。<br/>
                画像は<strong>5MB以下</strong>でお願いします。
            </div>

            {/* 見出し画像エリア */}
            <div style={{ marginBottom: "25px" }}>
                <label style={labelStyle}>見出し画像 <span style={{ color: "#F93D5D" }}>※</span></label>
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
                            <img src={previewUrl} alt="プレビュー" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "10px", display: "block", margin: "0 auto" }} />
                            <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "10px" }}>
                                <button onClick={handleImageRemove} style={{ padding: "8px 18px", border: "1px solid #ccc", backgroundColor: "#fff", borderRadius: "20px", cursor: "pointer", fontSize: "0.8rem", color: "#333" }}>削除</button>
                                <label style={{ padding: "8px 18px", backgroundColor: "#333", color: "white", borderRadius: "20px", cursor: "pointer", fontSize: "0.8rem", border: "1px solid #333" }}>
                                    変更
                                    <input type="file" onChange={handleImageUpload} style={{ display: "none" }} />
                                </label>
                            </div>
                        </div>
                    ) : (
                        <label style={{ cursor: "pointer", display: "block", padding: "20px 0" }}>
                            <div style={{ color: "#333", fontSize: "0.9rem", fontWeight: "700", marginBottom: "10px" }}>画像をアップロード</div>
                            <span style={{ display: "inline-block", padding: "8px 20px", backgroundColor: "#fff", color: "#333", borderRadius: "20px", border: "1.5px solid #ccc", fontSize: "0.85rem" }}>ファイルを選択</span>
                            <input type="file" onChange={handleImageUpload} style={{ display: "none" }} />
                        </label>
                    )}
                </div>
            </div>

            {/* 入力フィールド群 */}
            {[
                { label: "イベント名", name: "name", type: "text", placeholder: "例：鬼火祭り2025" },
                { label: "見出し", name: "catchphrase", type: "text", placeholder: "例：湯けむりに包まれる幻想の夜" },
                { label: "開始日", name: "start_date", type: "datetime-local" },
                { label: "終了日", name: "end_date", type: "datetime-local" },
                { label: "場所", name: "location", type: "text", placeholder: "例：温泉街広場" },
                { label: "URL", name: "url", type: "text", placeholder: "例：https://example.com" },
                { label: "主催者", name: "organizer", type: "text", placeholder: "例：観光協会" }
            ].map((field) => (
                <div key={field.name} style={{ marginBottom: "20px" }}>
                    <label style={labelStyle}>{field.label} <span style={{ color: "#F93D5D" }}>※</span></label>
                    <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = "#333"}
                        onBlur={(e) => e.target.style.borderColor = "#ccc"}
                    />
                </div>
            ))}

            {/* 予約セレクトボックス */}
            <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>予約 <span style={{ color: "#F93D5D" }}>※</span></label>
                <select
                    name="is_free_participation"
                    value={formData.is_free_participation}
                    onChange={handleChange}
                    style={{ ...inputStyle, border: "1.5px solid #ccc" }}
                    onFocus={(e) => e.target.style.borderColor = "#333"}
                    onBlur={(e) => e.target.style.borderColor = "#ccc"}
                >
                    <option value="">選択してください</option>
                    <option value="0">要予約</option>
                    <option value="1">自由参加</option>
                </select>
            </div>

            {/* 詳細・注意事項 */}
            <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>詳細</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    style={{ ...inputStyle, resize: "none" }}
                    onFocus={(e) => e.target.style.borderColor = "#333"}
                    onBlur={(e) => e.target.style.borderColor = "#ccc"}
                />
            </div>

            <div style={{ marginBottom: "30px" }}>
                <label style={labelStyle}>注意事項</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    style={{ ...inputStyle, resize: "none" }}
                    onFocus={(e) => e.target.style.borderColor = "#333"}
                    onBlur={(e) => e.target.style.borderColor = "#ccc"}
                />
            </div>

            {/* 送信ボタン (ピンク色に変更) */}
            <button
                onClick={handleEventSubmit}
                style={{
                    width: "100%",
                    padding: "16px",
                    backgroundColor: "#F93D5D", // ピンク色に変更
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 10px rgba(249, 61, 93, 0.3)"
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

export default EventForm;