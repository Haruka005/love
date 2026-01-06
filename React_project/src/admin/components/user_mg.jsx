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
  const [selectedUser, setSelectedUser] = useState(null); // モーダル用
  const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("admintoken");
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
  useEffect(() => {
    fetch("http://localhost:8000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("ユーザー取得エラー", err));
  }, []);

  const handleEdit = (user) => {
    setSelectedUser({ ...user }); // 編集対象ユーザーセット
    setShowModal(true);
  };

  const handleChange = (e) => {
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    fetch(`http://localhost:8000/api/users/${selectedUser.id}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedUser),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("更新しました");
        setShowModal(false);
        // 再読み込み
        return fetch("http://localhost:8000/api/users")
          .then((res) => res.json())
          .then((data) => setUsers(data));
      })
      .catch((err) => console.error("更新エラー", err));
  };

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
                                <button onClick={() => handleEdit(u)} style={{ marginRight: "5px" }}>編集</button>
                                <button>削除</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button style={{ marginTop: "10px", padding: "8px 15px", cursor: "pointer" }}>＋ 新規ユーザー追加</button>

      {/* 編集モーダル */}
      {showModal && selectedUser && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 8, width: "300px" }}>
            <h3>ユーザーの編集</h3>
            <div>
              <label>名前：</label>
              <input name="name" value={selectedUser.name} onChange={handleChange} />
            </div>
            <div style={{ marginTop: 10 }}>
              <label>メール：</label>
              <input name="email" value={selectedUser.email} onChange={handleChange} />
            </div>
            <div style={{ marginTop: 20 }}>
              <button onClick={handleSave}>保存</button>
              <button onClick={() => setShowModal(false)} style={{ marginLeft: 10 }}>キャンセル</button>
            </div>
          </div>
        </div>
      )}
        </div>
    );
}

export default UserManagement;
