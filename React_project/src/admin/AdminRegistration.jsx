import React, { useState } from "react";

const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};
const API_BASE = getBaseApiUrl();

export default function AdminRegistration() {
    const [formData, setFormData] = useState({ 
        name: "", 
        email: "", 
        password: "", 
        role: "user" 
    });
    const [status, setStatus] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);
    
    // --- パスワード表示状態の管理 ---
    const [showPassword, setShowPassword] = useState(false);

    const checks = {
        length: formData.password.length >= 12,
        upper: /[A-Z]/.test(formData.password),
        lower: /[a-z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
        symbol: /[@#!%*+=_?-]/.test(formData.password),
    };

    const isPasswordValid = Object.values(checks).every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isPasswordValid) return;

        setLoading(true);
        setStatus({ type: "", message: "" });
        const token = localStorage.getItem("admintoken");

        try {
            const res = await fetch(`${API_BASE}/admin/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                const label = formData.role === "admin" ? "管理者" : "一般ユーザー";
                setStatus({ type: "success", message: `新規${label}「${formData.name}」を登録しました。` });
                setFormData({ name: "", email: "", password: "", role: "user" });
            } else {
                setStatus({ type: "error", message: data.message || "登録に失敗しました。" });
            }
        } catch (error) {
            setStatus({ type: "error", message: "サーバーと通信できませんでした。" });
        } finally {
            setLoading(false);
        }
    };

    const getCheckStyle = (isValid) => ({
        fontSize: "13px",
        color: isValid ? "#28a745" : "#6c757d",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "4px",
        fontWeight: isValid ? "bold" : "normal"
    });

    return (
        <div style={{ maxWidth: "500px", margin: "20px auto", padding: "20px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <h3 style={{ marginBottom: "25px", textAlign: "center", color: "#333", borderBottom: "2px solid #f93d5d", paddingBottom: "10px" }}>
                アカウント新規作成
            </h3>
            
            {status.message && (
                <div style={{ padding: "15px", marginBottom: "20px", borderRadius: "8px", fontSize: "14px", fontWeight: "bold", backgroundColor: status.type === "success" ? "#d4edda" : "#f8d7da", color: status.type === "success" ? "#155724" : "#721c24", border: `1px solid ${status.type === "success" ? "#c3e6cb" : "#f5c6cb"}` }}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "10px", border: "1px solid #eee" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "12px", color: "#555" }}>付与する権限</label>
                    <div style={{ display: "flex", gap: "40px" }}>
                        <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}><input type="radio" value="user" checked={formData.role === "user"} onChange={(e) => setFormData({...formData, role: e.target.value})} /> 一般ユーザー</label>
                        <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", color: "#f93d5d", fontWeight: "bold" }}><input type="radio" value="admin" checked={formData.role === "admin"} onChange={(e) => setFormData({...formData, role: e.target.value})} /> 管理者</label>
                    </div>
                </div>

                <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "5px", color: "#666" }}>氏名</label>
                    <input type="text" required value={formData.name} placeholder="例: 山田 太郎" onChange={(e) => setFormData({...formData, name: e.target.value})}
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px", boxSizing: "border-box" }} />
                </div>

                <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "5px", color: "#666" }}>メールアドレス</label>
                    <input type="email" required value={formData.email} placeholder="example@mail.com" onChange={(e) => setFormData({...formData, email: e.target.value})}
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px", boxSizing: "border-box" }} />
                </div>

                {/* パスワード入力エリア */}
                <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "5px", color: "#666" }}>初期パスワード</label>
                    <div style={{ position: "relative", marginBottom: "10px" }}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            required 
                            value={formData.password}
                            placeholder="複雑なパスワードを設定してください"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            style={{ 
                                width: "100%", padding: "12px", paddingRight: "50px", borderRadius: "8px", 
                                border: isPasswordValid ? "2px solid #28a745" : "1px solid #ddd", 
                                fontSize: "16px", boxSizing: "border-box", outline: "none"
                            }}
                        />
                        {/* 表示/非表示切り替えボタン */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                                background: "none", border: "none", cursor: "pointer", fontSize: "20px"
                            }}
                        >
                            {showPassword ? "😀" : "😑"}
                        </button>
                    </div>

                    <div style={{ background: "#fdfdfd", padding: "12px", borderRadius: "8px", border: "1px dashed #ccc" }}>
                        <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#888", fontWeight: "bold" }}>パスワード必須条件:</p>
                        <div style={getCheckStyle(checks.length)}>{checks.length ? "✅" : "⚪"} 12文字以上</div>
                        <div style={getCheckStyle(checks.upper)}>{checks.upper ? "✅" : "⚪"} 大文字 (A-Z)</div>
                        <div style={getCheckStyle(checks.lower)}>{checks.lower ? "✅" : "⚪"} 小文字 (a-z)</div>
                        <div style={getCheckStyle(checks.number)}>{checks.number ? "✅" : "⚪"} 半角数字 (0-9)</div>
                        <div style={getCheckStyle(checks.symbol)}>{checks.symbol ? "✅" : "⚪"} 記号 (@#!%*+=_-?)</div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading || !isPasswordValid}
                    style={{ 
                        marginTop: "10px", padding: "15px", 
                        background: isPasswordValid ? "#f93d5d" : "#e0e0e0", 
                        color: "#fff", border: "none", borderRadius: "30px", fontWeight: "bold", 
                        cursor: isPasswordValid ? "pointer" : "not-allowed",
                        fontSize: "16px", boxShadow: isPasswordValid ? "0 4px 15px rgba(249,61,93,0.3)" : "none",
                        transition: "all 0.3s ease"
                    }}
                >
                    {loading ? "登録中..." : "新規アカウントを登録"}
                </button>
            </form>
        </div>
    );
}