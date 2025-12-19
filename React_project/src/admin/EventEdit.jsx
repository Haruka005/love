import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EventEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    // 画像プレビュー・ファイル用
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);

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

    const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/events/${id}`;

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(API_URL, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    
                    // 日付形式の調整
                    if (data.start_date) data.start_date = data.start_date.replace(' ', 'T').slice(0, 16);
                    if (data.end_date) data.end_date = data.end_date.replace(' ', 'T').slice(0, 16);
                    
                    setFormData(data);

                    // 既存画像があれば表示
                    if (data.image_path) {
                        setPreviewUrl(`${process.env.REACT_APP_API_URL}/storage/${data.image_path}`);
                    }
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
        fetchEvent();
    }, [id, API_URL, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 画像選択時の処理
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // プレビュー表示
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!window.confirm("編集内容を保存しますか？")) return;

        try {
            const token = localStorage.getItem("token");
            const data = new FormData();
            
            // LaravelのPUT制限対策
            data.append("_method", "PUT");

            // 全項目をFormDataに追加（必須バリデーションはなし）
            Object.entries(formData).forEach(([key, value]) => {
                // nullやundefinedでない場合のみ追加
                if (value !== null && value !== undefined) {
                    data.append(key, value);
                }
            });

            // 新しい画像が選ばれていれば追加
            if (imageFile) {
                data.append("image", imageFile);
            }

            const response = await fetch(API_URL, {
                method: "POST", // ファイルを含む場合はPOSTで送り、内部でPUTとして処理
                headers: {
                    "Authorization": `Bearer ${token}`
                    // Content-TypeはFormDataの場合は指定不要（ブラウザが自動設定する）
                },
                body: data
            });

            if (response.ok) {
                alert("更新が完了しました");
                navigate(-1);
            } else {
                alert("更新に失敗しました");
            }
        } catch (error) {
            console.error("Update Error:", error);
        }
    };

    if (loading) return <p style={{ padding: "20px" }}>読み込み中...</p>;

    return (
        <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#fff" }}>
            <h2>イベント内容の編集 (管理者)</h2>
            <form onSubmit={handleSubmit}>
                
                {/* 画像プレビューと変更ボタン */}
                <div style={inputGroupStyle}>
                    <label style={{ fontWeight: "bold" }}>見出し画像</label>
                    <div style={{ marginTop: "10px", textAlign: "center", border: "1px dashed #ccc", padding: "10px" }}>
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: "200px" }} />
                        ) : <p>画像が設定されていません</p>}
                        <div style={{ marginTop: "10px" }}>
                            <input type="file" onChange={handleImageChange} />
                        </div>
                    </div>
                </div>

                <div style={inputGroupStyle}>
                    <label>イベント名</label>
                    <input type="text" name="name" value={formData.name || ""} onChange={handleChange} style={inputStyle} />
                </div>

                <div style={inputGroupStyle}>
                    <label>見出し (キャッチコピー)</label>
                    <input type="text" name="catchphrase" value={formData.catchphrase || ""} onChange={handleChange} style={inputStyle} />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ ...inputGroupStyle, flex: 1 }}>
                        <label>開始日時</label>
                        <input type="datetime-local" name="start_date" value={formData.start_date || ""} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div style={{ ...inputGroupStyle, flex: 1 }}>
                        <label>終了日時</label>
                        <input type="datetime-local" name="end_date" value={formData.end_date || ""} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>

                <div style={inputGroupStyle}>
                    <label>場所</label>
                    <input type="text" name="location" value={formData.location || ""} onChange={handleChange} style={inputStyle} />
                </div>

                <div style={inputGroupStyle}>
                    <label>主催者</label>
                    <input type="text" name="organizer" value={formData.organizer || ""} onChange={handleChange} style={inputStyle} />
                </div>

                <div style={inputGroupStyle}>
                    <label>予約</label>
                    <select name="is_free_participation" value={formData.is_free_participation} onChange={handleChange} style={inputStyle}>
                        <option value="">選択してください</option>
                        <option value="0">要予約</option>
                        <option value="1">自由参加</option>
                    </select>
                </div>

                <div style={inputGroupStyle}>
                    <label>公式サイトURL</label>
                    <input type="text" name="url" value={formData.url || ""} onChange={handleChange} style={inputStyle} />
                </div>

                <div style={inputGroupStyle}>
                    <label>詳細説明</label>
                    <textarea name="description" value={formData.description || ""} onChange={handleChange} style={{ ...inputStyle, height: "100px" }} />
                </div>

                <div style={inputGroupStyle}>
                    <label>注意事項</label>
                    <textarea name="notes" value={formData.notes || ""} onChange={handleChange} style={{ ...inputStyle, height: "80px" }} />
                </div>

                <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
                    <button type="submit" style={saveButtonStyle}>変更を保存</button>
                    <button type="button" onClick={() => navigate(-1)} style={cancelButtonStyle}>キャンセル</button>
                </div>
            </form>
        </div>
    );
}

const inputGroupStyle = { marginBottom: "15px" };
const inputStyle = { width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", marginTop: "5px", boxSizing: "border-box" };
const saveButtonStyle = { flex: 1, padding: "12px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" };
const cancelButtonStyle = { flex: 1, padding: "12px", backgroundColor: "#f0f0f0", color: "#333", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer" };