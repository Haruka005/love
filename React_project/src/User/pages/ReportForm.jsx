import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // navigateを使うために追加

//お問合せ・通報フォーム
export default function ReportForm() {
    const navigate = useNavigate(); // navigateの初期化

    const [formData, setData] = useState({
        name: "",
        email: "",
        reason: "",
    });

    const [status, setStatus] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            const response = await fetch("http://localhost:8000/api/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus({ type: "success", message: "通報が送信されました。ご協力ありがとうございます。" });
                setData({ name: "", email: "", reason: "" });
            } else {
                setStatus({ type: "error", message: "送信に失敗しました。内容を確認してください。" });
            }
        } catch (error) {
            setStatus({ type: "error", message: "サーバーと通信できませんでした。" });
        } finally {
            setLoading(false);
        }
    };

    // ✕ ボタンのスタイル（マイページのデザインを適用）
    const closeButtonStyle = {
        backgroundColor: "#eee",
        color: "#666",
        border: "none",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        fontSize: "20px",
        cursor: "pointer",
        margin: "20px auto",
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        padding: 0, 
        lineHeight: 1, 
    };

    // ページ独自の追加スタイル
    const localStyles = (
        <style>{`
            .report-page-container {
                padding-top: 80px; /* ヘッダー固定分 */
                padding-bottom: 50px;
            }
            .report-description {
                text-align: center;
                font-size: 0.9rem;
                color: #666;
                margin-bottom: 20px;
                padding: 0 20px;
            }
            .report-form-box {
                margin-top: 10px;
            }
            .input-label {
                display: block;
                text-align: left;
                margin-bottom: 5px;
                font-weight: bold;
                font-size: 0.9rem;
                color: #555;
            }
            .required-tag {
                background-color: #F93D5D;
                color: white;
                font-size: 0.7rem;
                padding: 2px 6px;
                border-radius: 4px;
                margin-left: 5px;
                vertical-align: middle;
            }
            .status-banner {
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                font-weight: bold;
                font-size: 0.9rem;
            }
            .status-banner.success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
            .status-banner.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
            
            textarea.custom-textarea {
                width: 100%;
                padding: 12px 16px;
                font-size: 16px;
                border: 1.5px solid #ccc;
                border-radius: 8px;
                outline: none;
                transition: all 0.2s ease;
                font-family: inherit;
            }
            textarea.custom-textarea:focus { border-color: #f93d5d; }
        `}</style>
    );

    return (
        <div className="main-background report-page-container">
            {localStyles}
            
            <section className="container">
                <h1>お問い合わせ・通報フォーム</h1>
                <p className="report-description">
                    不適切な投稿や規約違反を見つけた場合は、こちらからお知らせください。
                </p>

                {status.message && (
                    <div className={`status-banner ${status.type}`}>
                        {status.message}
                    </div>
                )}

                <div className="form-container report-form-box">
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label className="input-label">お名前（任意）</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="例：登別 太郎"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label className="input-label">
                                メールアドレス<span className="required-tag">必須</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="example@mail.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label className="input-label">
                                お問い合わせ・通報の理由<span className="required-tag">必須</span>
                            </label>
                            <textarea
                                name="reason"
                                className="custom-textarea"
                                rows="6"
                                placeholder="詳細をご記入ください。"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? "送信中..." : "この内容で通報する"}
                        </button>
                    </form>
                </div>

                {/* ✕ ボタン（通報するボタンのすぐ下に配置） */}
                <button
                    style={closeButtonStyle}
                    onClick={() => navigate("/")}
                >
                    ✕
                </button>
                
            </section>
        </div>
    );
}