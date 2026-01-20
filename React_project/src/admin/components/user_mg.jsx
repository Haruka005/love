import React, { useState, useEffect, useCallback } from "react";

const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};
const API_BASE = getBaseApiUrl();

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [adminMe, setAdminMe] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [history, setHistory] = useState([]);

    const token = localStorage.getItem("admintoken");
    const headers = {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
    };

    const fetchAdminMe = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/me`, { headers });
            if (res.ok) {
                const data = await res.json();
                setAdminMe(data);
            }
        } catch (err) {
            console.error("管理者情報取得失敗", err);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/users?search=${searchTerm}`, { headers });
            if (!res.ok) throw new Error("取得失敗");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error("ユーザー取得エラー:", err);
        }
    }, [searchTerm]);

    useEffect(() => {
        fetchAdminMe();
        fetchUsers();

        const timer = setInterval(() => {
            fetchUsers();
        }, 30000);

        return () => clearInterval(timer);
    }, [fetchAdminMe, fetchUsers]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/admin/users/${editingUser.id}`, {
                method: "PUT",
                headers,
                body: JSON.stringify(editingUser)
            });
            if (res.ok) {
                alert("更新しました");
                setEditingUser(null);
                fetchUsers();
            } else {
                const errorData = await res.json();
                alert("更新失敗: " + errorData.message);
            }
        } catch (err) {
            console.error("更新エラー:", err);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("このユーザーを完全に削除しますか？")) return;
        try {
            const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
                method: "DELETE",
                headers
            });
            if (res.ok) {
                alert("削除しました");
                fetchUsers();
            }
        } catch (err) {
            console.error("削除エラー:", err);
        }
    };

    const showHistory = async (userId) => {
        try {
            const res = await fetch(`${API_BASE}/admin/users/${userId}/history`, { headers });
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (err) {
            console.error("履歴取得エラー:", err);
        }
    };

    return (
        <div style={{ padding: "15px", backgroundColor: "#F4F7F6", minHeight: "100vh", fontFamily: "sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
                {adminMe && (
                    <div style={{ fontSize: "12px", color: "#666" }}>
                        管理者: <strong>{adminMe.name}</strong>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="名前・メールで検索"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "100%", maxWidth: "400px", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" }}
                />
            </div>

            <div style={{ backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                    <thead>
                        <tr style={{ background: "#F8F9FA", borderBottom: "1px solid #eee" }}>
                            <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", color: "#666" }}>ID</th>
                            <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", color: "#666" }}>名前 / ステータス</th>
                            <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", color: "#666" }}>メールアドレス</th>
                            <th style={{ padding: "12px", textAlign: "center", fontSize: "13px", color: "#666" }}>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} style={{ borderBottom: "1px solid #F9F9F9" }}>
                                <td style={{ padding: "12px", fontSize: "13px" }}>{u.id}</td>
                                <td style={{ padding: "12px" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>{u.name}</span>
                                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                            {u.is_online && (
                                                <span style={{ backgroundColor: "#D4EDDA", color: "#155724", fontSize: "10px", padding: "1px 6px", borderRadius: "4px", border: "1px solid #C3E6CB", fontWeight: "bold" }}>オンライン</span>
                                            )}
                                            {u.user_status === 0 && (
                                                <span style={{ backgroundColor: "#FFF3CD", color: "#856404", fontSize: "10px", padding: "1px 6px", borderRadius: "4px", border: "1px solid #FFEEBA", fontWeight: "bold" }}>停止中</span>
                                            )}
                                            {u.is_locked && (
                                                <span style={{ backgroundColor: "#F8D7DA", color: "#721C24", fontSize: "10px", padding: "1px 6px", borderRadius: "4px", border: "1px solid #F5C6CB", fontWeight: "bold" }}>ロック中</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: "12px", fontSize: "13px", color: "#444" }}>{u.email}</td>
                                <td style={{ padding: "12px" }}>
                                    <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                                        <button onClick={() => setEditingUser(u)} style={{ padding: "6px 10px", border: "1px solid #007BFF", color: "#007BFF", background: "#fff", borderRadius: "4px", cursor: "pointer", fontSize: "12px", minWidth: "50px" }}>編集</button>
                                        <button onClick={() => showHistory(u.id)} style={{ padding: "6px 10px", border: "1px solid #28A745", color: "#28A745", background: "#fff", borderRadius: "4px", cursor: "pointer", fontSize: "12px", minWidth: "50px" }}>履歴</button>
                                        <button onClick={() => handleDelete(u.id)} style={{ padding: "6px 10px", border: "1px solid #DC3545", color: "#DC3545", background: "#fff", borderRadius: "4px", cursor: "pointer", fontSize: "12px", minWidth: "50px" }}>削除</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {history.length > 0 && (
                <div style={{ marginTop: "20px", background: "#fff", padding: "15px", borderRadius: "10px", border: "1px solid #eee" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <h4 style={{ margin: 0, fontSize: "15px" }}>ログイン履歴</h4>
                        <button onClick={() => setHistory([])} style={{ color: "#DC3545", background: "none", border: "none", fontSize: "12px", cursor: "pointer" }}>閉じる</button>
                    </div>
                    {history.map((h, i) => (
                        <div key={i} style={{ fontSize: "12px", padding: "8px 0", borderBottom: "1px solid #F4F4F4", color: "#666" }}>
                            {new Date(h.created_at).toLocaleString()} - アクセス記録
                        </div>
                    ))}
                </div>
            )}

            {editingUser && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000, padding: "20px", boxSizing: "border-box" }}>
                    <div style={{ backgroundColor: "#fff", padding: "25px", borderRadius: "12px", width: "100%", maxWidth: "400px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
                        <h3 style={{ marginTop: 0, marginBottom: "20px", fontSize: "18px" }}>ユーザー情報の編集</h3>
                        <form onSubmit={handleUpdate}>
                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#666" }}>名前</label>
                                <input style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box" }} type="text" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} required />
                            </div>
                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#666" }}>メール</label>
                                <input style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box" }} type="email" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} required />
                            </div>
                            
                            <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#F9F9F9", borderRadius: "8px" }}>
                                <div style={{ marginBottom: "10px" }}>
                                    <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#333", fontWeight: "bold" }}>アカウント状態</label>
                                    <select 
                                        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                                        value={editingUser.user_status} 
                                        onChange={e => setEditingUser({...editingUser, user_status: parseInt(e.target.value)})}
                                    >
                                        <option value={1}>有効 (Active)</option>
                                        <option value={0}>停止 (Suspended)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#333", fontWeight: "bold" }}>ロック状態</label>
                                    <select 
                                        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                                        value={editingUser.is_locked ? "1" : "0"} 
                                        onChange={e => setEditingUser({...editingUser, is_locked: e.target.value === "1"})}
                                    >
                                        <option value="0">通常（解除）</option>
                                        <option value="1">ロック中</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#666" }}>新パスワード（任意）</label>
                                <input style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box" }} type="password" placeholder="変更しない場合は空欄" onChange={e => setEditingUser({...editingUser, password: e.target.value})} />
                            </div>
                            
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button type="submit" style={{ flex: 1, padding: "12px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>保存</button>
                                <button type="button" onClick={() => setEditingUser(null)} style={{ flex: 1, padding: "12px", backgroundColor: "#F4F4F4", color: "#333", border: "none", borderRadius: "6px", fontSize: "14px", cursor: "pointer" }}>キャンセル</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;