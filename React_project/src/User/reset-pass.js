//パスワード再設定ページ

// Reactの基本機能（コンポーネント作成・状態管理）を読み込む
import React, { useState } from 'react';

// React Router のページ遷移機能を読み込む（✕ボタンでマイページに戻るため）
import { useNavigate } from 'react-router-dom';

// パスワード再設定画面のコンポーネント
function ResetPass() {
  const navigate = useNavigate(); // ✕ボタンでページ遷移するための関数

  // 入力されたフォームデータを保存する状態
  const [formData, setFormData] = useState({
    current: '****',     // 現在のパスワード（初期値は仮の文字列）
    newPw: '****',       // 新しいパスワード
    confirmPw: '****',   // 新しいパスワード（確認用）
    email: 'hello@reallygreatsite.com', // メールアドレス
  });

  // 入力欄が変更されたときに状態を更新する関数
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // フォームが送信されたときの処理
  const handleSubmit = (e) => {
    e.preventDefault(); // ページのリロードを防ぐ

    const { current, newPw, confirmPw, email } = formData;

    // 未入力の項目がある場合は警告
    if (!current || !newPw || !confirmPw || !email) {
      alert('全ての項目を入力してください');
      return;
    }

    // 新しいパスワードと確認用パスワードが一致しない場合は警告
    if (newPw !== confirmPw) {
      alert('新規パスワードと確認用パスワードが一致しません');
      return;
    }

    // パスワードの形式チェック（英大小文字・数字・記号を含む8文字以上）
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#?$%&]).{8,}$/;
    if (!pwRegex.test(newPw)) {
      alert('パスワードは英大小文字、数字、記号を含む8文字以上で入力してください');
      return;
    }

    // すべての条件を満たした場合
    alert('パスワード再設定を受付けました!');
  };

  // JSX（画面に表示する内容）を返す
  return (
    // ✕ボタンを固定表示するために position: "relative" を追加
    <div style={{ padding: "20px", fontFamily: "sans-serif", position: "relative" }}>
      
      {/* ✕ 閉じるボタン（画面左上に固定表示） */}
      <button
        onClick={() => navigate("/MyPage")} // マイページに戻る
        style={{
          position: "absolute", // 画面の左上に固定配置
          top: "10px",
          left: "10px",
          backgroundColor: "#eee", // 背景色（薄いグレー）
          color: "#333", // 文字色
          border: "none", // 枠線なし
          borderRadius: "50%", // 丸型にする
          width: "40px",
          height: "40px",
          fontSize: "20px",
          cursor: "pointer", // マウスカーソルをポインターに
        }}
      >
        ✕
      </button>

      {/* ページタイトル */}
      <h1 style={{ textAlign: "center", marginTop: "0" }}>パスワード再設定</h1>

      {/* パスワード再設定フォーム */}
      <form onSubmit={handleSubmit}>
        {/* 現在のパスワード */}
        <label htmlFor="current">現在のパスワード</label><br />
        <input type="password" id="current" value={formData.current} onChange={handleChange} /><br /><br />

        {/* パスワードの注意書き */}
        <p style={{ color: "#555", fontSize: "14px", marginBottom: "10px" }}>
          パスワードは <strong>英大小文字・半角数字・記号（!@,#,?,$,%,&）</strong> を含む
          <strong>8文字以上</strong>で作成してください。
        </p>

        {/* 新しいパスワード */}
        <label htmlFor="newPw">新規パスワード</label><br />
        <input type="password" id="newPw" value={formData.newPw} onChange={handleChange} /><br /><br />

        {/* 新しいパスワード（確認用） */}
        <label htmlFor="confirmPw">新規パスワード（確認用）</label><br />
        <input type="password" id="confirmPw" value={formData.confirmPw} onChange={handleChange} /><br /><br />

        {/* メールアドレス */}
        <label htmlFor="email">メールアドレス（送信用）</label><br />
        <input type="email" id="email" value={formData.email} onChange={handleChange} /><br /><br />

        {/* 送信ボタン */}
        <button type="submit">再設定</button>
      </form>
    </div>
  );
}

// 他のファイルからこのコンポーネントを使えるようにする
export default ResetPass;