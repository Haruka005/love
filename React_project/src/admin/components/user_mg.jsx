import { useState, useEffect } from "react";


function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
     fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
    })
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.error("ユーザー取得エラー", err));
    },[]);

    return (
    <div>
      <h2>ユーザー管理</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#ffe6ec" }}>
            <th>ID</th><th>名前</th><th>メール</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td>
              <td>
                <button style={{ marginRight: "5px" }}>編集</button>
                <button>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button style={{ marginTop: "10px" }}>＋ 新規ユーザー追加</button>
    </div>
  );
}

export default UserManagement;