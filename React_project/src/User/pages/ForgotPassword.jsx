//パスワード再設定フォーム
import React, { useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            // Laravelのapi.phpで作ったエンドポイントへ送信
            const response = await fetch('http://localhost:8000/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                // 成功したら「メールを送ったよ」と表示
                setMessage('パスワード再設定用のメールを送信しました。メールボックスを確認してください。');
            } else {
                // アドレスが存在しない場合などのエラー
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
                <h2>パスワードをお忘れですか？</h2>
                <p style={styles.subtext}>ご登録のメールアドレスを入力してください。再設定用のリンクをお送りします。</p>

                {message && <p style={styles.success}>{message}</p>}
                {error && <p style={styles.error}>{error}</p>}

                <div style={styles.inputGroup}>
                    <label>メールアドレス</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="example@gmail.com"
                    />
                </div>

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? '送信中...' : '再設定メールを送る'}
                </button>

                <div style={styles.footer}>
                    <a href="/Mypage" style={styles.link}>マイページに戻る</a>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', marginTop: '50px' },
    form: { width: '100%', maxWidth: '400px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' },
    subtext: { fontSize: '14px', color: '#666', marginBottom: '20px', lineHeight: '1.5' },
    inputGroup: { marginBottom: '20px', textAlign: 'left' },
    button: { width: '100%', padding: '10px', backgroundColor: '#F93D5D', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    success: { color: 'green', backgroundColor: '#e6fffa', padding: '10px', borderRadius: '4px', marginBottom: '10px' },
    error: { color: 'red', backgroundColor: '#fff5f5', padding: '10px', borderRadius: '4px', marginBottom: '10px' },
    footer: { marginTop: '20px' },
    link: { fontSize: '14px', color: '#F93D5D', textDecoration: 'none' }
};

export default ForgotPassword;