// src/User/reset-pass.js
import React, { useState } from 'react'; // React本体と、状態管理用のuseStateを読み込み

// パスワード再設定フォームのコンポーネント
function ResetPass() {
  // フォームの入力値を管理するためのstate（状態）
  const [formData, setFormData] = useState({
    current: '', // 現在のパスワード
    newPw: '',    // 新しいパスワード
    confirmPw: '', // 新しいパスワード（確認用）
    email: 'hello@reallygreatsite.com', // 初期値付きのメールアドレス
  });

  // 入力欄が変更されたときに呼ばれる関数
  const handleChange = (e) => {
    // 入力欄のIDをキーにして、対応する値を更新
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // フォームが送信されたときに呼ばれる関数
  const handleSubmit = (e) => {
    e.preventDefault(); // ページの再読み込みを防ぐ

    // 入力値を分割して取り出す（分割代入）
    const { current, newPw, confirmPw, email } = formData;

    // 未入力の項目がある場合は警告を表示
    if (!current || !newPw || !confirmPw || !email) {
      alert('全ての項目を入力してください');
      return;
    }

    // 新しいパスワードと確認用パスワードが一致しない場合
    if (newPw !== confirmPw) {
      alert('新規パスワードと確認用パスワードが一致しません');
      return;
    }

    // パスワードの条件（英大小文字・数字・記号を含む8文字以上）をチェック
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#?$%&]).{8,}$/;
    if (!pwRegex.test(newPw)) {
      alert('パスワードは英大小文字、数字、記号を含む8文字以上で入力してください');
      return;
    }

    // すべての条件を満たした場合の成功メッセージ
    alert('パスワード再設定を受付けました!');
  };

  // JSXでフォームのUIを定義
  return (
    <div>
      <h1>パスワード再設定</h1>
      <form onSubmit={handleSubmit}>
        {/* 現在のパスワード入力欄 */}
        <label htmlFor="current">現在のパスワード</label><br />
        <input
          type="password"
          id="current"
          value={formData.current}
          onChange={handleChange}
        /><br /><br />

        {/* 新しいパスワード入力欄 */}
        <label htmlFor="newPw">新規パスワード</label><br />
        <input
          type="password"
          id="newPw"
          value={formData.newPw}
          onChange={handleChange}
        /><br /><br />

        {/* 新しいパスワード（確認用）入力欄 */}
        <label htmlFor="confirmPw">新規パスワード（確認用）</label><br />
        <input
          type="password"
          id="confirmPw"
          value={formData.confirmPw}
          onChange={handleChange}
        /><br /><br />

        {/* メールアドレス入力欄 */}
        <label htmlFor="email">メールアドレス（送信用）</label><br />
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
        /><br /><br />

        {/* 送信ボタン */}
        <button type="submit">再設定</button>
      </form>
    </div>
  );
}

// 他のファイルからこのコンポーネントを使えるようにする
export default ResetPass;