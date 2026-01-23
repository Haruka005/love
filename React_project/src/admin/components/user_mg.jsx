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
    
    const [roleFilter, setRoleFilter] = useState("");   
    const [statusFilter, setStatusFilter] = useState(""); 

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
            const params = new URLSearchParams();
            if (searchTerm) params.append("search", searchTerm);
            if (roleFilter) params.append("role", roleFilter);
            
            if (statusFilter !== "" && statusFilter !== "online") {
                params.append("status", statusFilter);
            }

            const res = await fetch(`${API_BASE}/admin/users?${params.toString()}`, { headers });
            if (!res.ok) throw new Error("取得失敗");
            let data = await res.json();

            if (statusFilter === "online") {
                data = data.filter(u => u.is_online);
            }

            // 【修正】停止中で絞り込む際、nullやundefinedを排除し、厳密に 0 の人だけを残す
            if (statusFilter === "0") {
                data = data.filter(u => u.user_status !== null && Number(u.user_status) === 0);
            }

            setUsers(data);
        } catch (err) {
            console.error("ユーザー取得エラー:", err);
        }
    }, [searchTerm, roleFilter, statusFilter]);

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

            <div style={{ 
                marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap",
                backgroundColor: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
            }}>
                <input
                    type="text" placeholder="名前・メールで検索" value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 2, minWidth: "200px", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
                />
                
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                    style={{ flex: 1, minWidth: "120px", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}>
                    <option value="">すべての権限</option>
                    <option value="admin">管理者のみ</option>
                    <option value="user">一般ユーザーのみ</option>
                </select>

                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ flex: 1, minWidth: "120px", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}>
                    <option value="">すべての状態</option>
                    <option value="online">ログイン中</option>
                    <option value="1">有効なアカウント</option>
                    <option value="0">停止中のアカウント</option>
                </select>
            </div>

            <div style={{ backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                    <thead>
                        <tr style={{ background: "#F8F9FA", borderBottom: "1px solid #eee" }}>
                            <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", color: "#666" }}>ID</th>
                            <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", color: "#666" }}>ユーザー詳細</th>
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
                                            {u.role === 'admin' ? 
                                                <span style={{ background: "#E8EAF6", color: "#3F51B5", fontSize: "10px", padding: "1px 6px", borderRadius: "4px" }}>管理者</span> :
                                                <span style={{ background: "#F1F8E9", color: "#558B2F", fontSize: "10px", padding: "1px 6px", borderRadius: "4px" }}>一般</span>
                                            }
                                            {u.is_online && <span style={{ background: "#D4EDDA", color: "#155724", fontSize: "10px", padding: "1px 6px", borderRadius: "4px" }}>ログイン中</span>}
                                            
                                            {/* 【修正】user_status が null でなく、かつ 0 の時だけ「停止中」と表示 */}
                                            {u.user_status !== null && Number(u.user_status) === 0 && (
                                                <span style={{ background: "#FFF3CD", color: "#856404", fontSize: "10px", padding: "1px 6px", borderRadius: "4px", border: "1px solid #FFEEBA", fontWeight: "bold" }}>停止中</span>
                                            )}
                                            
                                            {u.is_locked && (
                                                <span style={{ background: "#F8D7DA", color: "#721C24", fontSize: "10px", padding: "1px 6px", borderRadius: "4px", border: "1px solid #F5C6CB" }}>ロック中</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: "12px", fontSize: "13px", color: "#444" }}>{u.email}</td>
                                <td style={{ padding: "12px" }}>
                                    <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                                        <button onClick={() => setEditingUser(u)} style={{ padding: "6px 10px", border: "1px solid #007BFF", color: "#007BFF", background: "#fff", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>編集</button>
                                        <button onClick={() => showHistory(u.id)} style={{ padding: "6px 10px", border: "1px solid #28A745", color: "#28A745", background: "#fff", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>履歴</button>
                                        <button onClick={() => handleDelete(u.id)} style={{ padding: "6px 10px", border: "1px solid #DC3545", color: "#DC3545", background: "#fff", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>削除</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingUser && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 }}>
                    <div style={{ backgroundColor: "#fff", padding: "25px", borderRadius: "12px", width: "90%", maxWidth: "400px" }}>
                        <h3 style={{ marginTop: 0 }}>ユーザー編集</h3>
                        <form onSubmit={handleUpdate}>
                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ fontSize: "12px" }}>名前</label>
                                <input style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} type="text" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                            </div>
                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ fontSize: "12px" }}>メール</label>
                                <input style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} type="email" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
                            </div>
                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ fontSize: "12px" }}>権限</label>
                                <select style={{ width: "100%", padding: "8px" }} value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})}>
                                    <option value="user">一般ユーザー</option>
                                    <option value="admin">管理者</option>
                                </select>
                            </div>
                            
                            <div style={{ padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "8px", marginBottom: "15px" }}>
                                <div style={{ marginBottom: "10px" }}>
                                    <label style={{ fontSize: "12px", fontWeight: "bold" }}>アカウント状態</label>
                                    <select style={{ width: "100%", padding: "5px" }} value={editingUser.user_status ?? 1} onChange={e => setEditingUser({...editingUser, user_status: parseInt(e.target.value)})}>
                                        <option value={1}>有効</option>
                                        <option value={0}>停止中 (ログイン禁止)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: "12px", fontWeight: "bold" }}>ロック解除</label>
                                    <select style={{ width: "100%", padding: "5px" }} value={editingUser.is_locked ? "1" : "0"} onChange={e => setEditingUser({...editingUser, is_locked: e.target.value === "1"})}>
                                        <option value="0">通常 (解除する)</option>
                                        <option value="1">ロック中 (ログイン不可)</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button type="submit" style={{ flex: 1, padding: "10px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px" }}>保存</button>
                                <button type="button" onClick={() => setEditingUser(null)} style={{ flex: 1, padding: "10px", backgroundColor: "#eee", border: "none", borderRadius: "4px" }}>閉じる</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;

