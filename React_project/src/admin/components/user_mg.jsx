import { useState, useEffect } from "react";

/**
 * APIのベースURLを安全に構築
 */
const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    const base = envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
    return base;
};

const API_BASE = getBaseApiUrl();

function UserManagement() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${API_BASE}/users`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => setUsers(data))
            .catch((err) => console.error("ユーザー取得エラー", err));
    }, []);

    return (
        <div>
            <h2>ユーザー管理</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "#ffe6ec" }}>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>ID</th>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>名前</th>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>メール</th>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{u.id}</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{u.name}</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{u.email}</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                <button style={{ marginRight: "5px" }}>編集</button>
                                <button>削除</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button style={{ marginTop: "10px", padding: "8px 15px", cursor: "pointer" }}>＋ 新規ユーザー追加</button>
        </div>
    );
}

export default UserManagement;