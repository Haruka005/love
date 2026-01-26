import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

//パスワード再設定画面
const ResetPassword = () => {
    const [searchParams] = useSearchParams(); //URLを解析するため
    const navigate = useNavigate();

    //URLからトークンとメールアドレスを取得
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    //画面のデータの状態を保持
    const [password, setPassword] = useState('');  //入力中のパスワードを保持
    const [passwordConfirmation, setPasswordConfirmation] = useState('');  //確認用パスワードを保持
    const [message, setMessage] = useState('');  //成功メッセージを保持
    const [error, setError] = useState('');  //失敗メッセージを保持
    const [loading, setLoading] = useState(false);  //ローディング保持

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        //条件チェック
       if (password.length < 12) {
            setError("パスワードは12文字以上にしてください");
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setError("大文字（A～Z）を入れてください");
            return;
        }
        if (!/[a-z]/.test(password)) {
            setError("小文字（a～z）を入れてください");
            return;
        }
        if (!/[0-9]/.test(password)) {
            setError("半角数字（0～9）を入れてください");
            return;
        }
        // 記号のチェック（!@&? 以外も含む一般的な記号の正規表現にしています）
        if (!/[@#!%*+=_?-]/.test(password)) {
            setError("記号（@#!%*+=_-?）を入れてください");
            return;
        }
        if (password !== passwordConfirmation) {
            setError('パスワードが一致しません');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    email,
                    password,
                    password_confirmation: passwordConfirmation, // Laravel側はスネークケース
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('パスワードを更新しました！ログイン画面へ移動します...');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(data.message || 'エラーが発生しました');
            }
        } catch (err) {
            setError('サーバーとの通信に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>新しいパスワードを設定</h2>
                <p style={styles.subtext}>{email} さんのパスワードを更新します</p>

                {message && <p style={styles.success}>{message}</p>}
                {error && <p style={styles.error}>{error}</p>}

                <div style={styles.inputGroup}>
                    <label>新しいパスワード</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="12文字以上、大文字・小文字・数字・記号"
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>パスワードの確認</label>
                    <input
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? '更新中...' : 'パスワードを更新する'}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', marginTop: '50px' },
    form: { width: '100%', maxWidth: '400px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' },
    subtext: { fontSize: '14px', color: '#666', marginBottom: '20px' },
    inputGroup: { marginBottom: '15px', textAlign: 'left' },
    button: { width: '100%', padding: '10px', backgroundColor: '#f53003', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    error: { color: 'red', marginBottom: '10px' },
    success: { color: 'green', marginBottom: '10px' }
};

export default ResetPassword;