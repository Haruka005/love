function UserManagement() {
  const dummyUsers = [
    { id: 1, name: "山田太郎", email: "taro@example.com" },
    { id: 2, name: "佐藤花子", email: "hanako@example.com" },
  ];
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
          {dummyUsers.map((u) => (
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