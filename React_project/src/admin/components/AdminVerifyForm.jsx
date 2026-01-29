import React from "react";

// 管理者用認証コード入力フォームコンポーネント
const AdminVerifyForm = ({ code, setCode, handleVerify, setError, setStep, error }) => {
  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#e9f0ff",
    textAlign: "center",
    fontSize: "20px",
    letterSpacing: "5px"
  };

  return (
    <form onSubmit={handleVerify}>
      <p style={{ marginBottom: "20px", fontSize: "14px", color: "#666" }}>
        メールに届いた6桁の認証コードを入力してください。
      </p>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text" value={code}
          onChange={(e) => setCode(e.target.value)}
          required maxLength="6" placeholder="000000"
          style={inputStyle}
        />
      </div>
      {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}
      <button
        type="submit"
        style={{ width: "100%", padding: "12px", border: "2px solid #f35", borderRadius: "8px", color: "white", background: "#f35", fontWeight: "bold", cursor: "pointer", marginBottom: "10px" }}
      >
        認証を完了する
      </button>
      <button
        type="button"
        onClick={() => { setError(""); setStep("login"); }}
        style={{ background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: "12px" }}
      >
        ログイン画面に戻る
      </button>
    </form>
  );
};

export default AdminVerifyForm;

