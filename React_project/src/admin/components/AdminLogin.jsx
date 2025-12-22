import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "test@example.com" && password === "123456Aa@@@@@@") {
      navigate("/AdminTop");
    } else {
      setError("メールアドレスまたはパスワードが正しくありません");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "60px", // ← 少し上にする
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "20px", // ← 角丸強く
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
          width: "420px", // ← 横幅調整
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          管理者<span style={{ fontWeight: "normal" }}>ログイン</span>
        </h2>

        <hr
          style={{
            borderTop: "2px dotted #333",
            marginBottom: "30px",
            width: "80%",
            margin: "0 auto 30px",
          }}
        />

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="test@example.com"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundColor: "#e9f0ff",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="パスワード"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundColor: "#e9f0ff",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #f35",
              borderRadius: "8px",
              color: "#f35",
              background: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
