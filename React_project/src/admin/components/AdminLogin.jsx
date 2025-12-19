import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // 👇 開発中はAPIなしで即遷移
    if (email && password) {
      navigate("/AdminTop");
    } else {
      setError("メールアドレスとパスワードを入力してください");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>管理者ログイン</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>メールアドレス：</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>パスワード：</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
};

export default AdminLogin;
