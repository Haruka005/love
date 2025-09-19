// src/User/reset-pass.js
import React, { useState } from 'react';

function ResetPass() {
  const [formData, setFormData] = useState({
    current: '',
    newPw: '',
    confirmPw: '',
    email: 'hello@reallygreatsite.com',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { current, newPw, confirmPw, email } = formData;

    if (!current || !newPw || !confirmPw || !email) {
      alert('全ての項目を入力してください');
      return;
    }

    if (newPw !== confirmPw) {
      alert('新規パスワードと確認用パスワードが一致しません');
      return;
    }

    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#?$%&]).{8,}$/;
    if (!pwRegex.test(newPw)) {
      alert('パスワードは英大小文字、数字、記号を含む8文字以上で入力してください');
      return;
    }

    alert('パスワード再設定を受付けました!');
  };

  return (
    <div>
      <h1>パスワード再設定</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="current">現在のパスワード</label><br />
        <input type="password" id="current" value={formData.current} onChange={handleChange} /><br /><br />

        <label htmlFor="newPw">新規パスワード</label><br />
        <input type="password" id="newPw" value={formData.newPw} onChange={handleChange} /><br /><br />

        <label htmlFor="confirmPw">新規パスワード（確認用）</label><br />
        <input type="password" id="confirmPw" value={formData.confirmPw} onChange={handleChange} /><br /><br />

        <label htmlFor="email">メールアドレス（送信用）</label><br />
        <input type="email" id="email" value={formData.email} onChange={handleChange} /><br /><br />

        <button type="submit">再設定</button>
      </form>
    </div>
  );
}

export default ResetPass;