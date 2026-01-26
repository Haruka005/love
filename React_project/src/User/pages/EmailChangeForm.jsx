//メールアドレス変更フォーム
import React, { useState } from 'react';

const EmailChangeForm = () => {
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        // ローカルストレージ等に保存してある認証トークンを取得
        const token = localStorage.getItem('token'); 

        try {
            // 先ほどUserControllerで作ったエンドポイントへ送信
            const response = await fetch('http://localhost:8000/api/email-change-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`, // ミドルウェアを通すために必要
                },
                body: JSON.stringify({ 
                    new_email: newEmail, 
                    password: password 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('新しいアドレスに確認メールを送信しました。メール内のリンクをクリックして変更を完了させてください。');
                setNewEmail('');
                setPassword('');
            } else {
                // バリデーションエラーやパスワード間違いなど
                setError(data.error || data.message || 'エラーが発生しました');
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
                <h2 style={{ color: '#333' }}>メールアドレスの変更</h2>
                <p style={styles.subtext}>新しいメールアドレスを入力してください。<br/>本人確認のため現在のパスワードが必要です。</p>

                {message && <p style={styles.success}>{message}</p>}
                {error && <p style={styles.error}>{error}</p>}

                <div style={styles.inputGroup}>
                    <label style={styles.label}>新しいメールアドレス</label>
                    <input
                        style={styles.input}
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                        placeholder="new-email@example.com"
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>現在のパスワード</label>
                    <input
                        style={styles.input}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="パスワードを入力"
                    />
                </div>

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? '処理中...' : '確認メールを送る'}
                </button>

                <div style={styles.footer}>
                    <a href="/mypage" style={styles.link}>マイページに戻る</a>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', marginTop: '50px' },
    form: { width: '100%', maxWidth: '400px', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    subtext: { fontSize: '14px', color: '#666', marginBottom: '25px', lineHeight: '1.5' },
    inputGroup: { marginBottom: '20px', textAlign: 'left' },
    label: { display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: '#555' },
    input: { width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' },
    button: { width: '100%', padding: '12px', backgroundColor: '#F93D5D', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
    success: { color: '#0f5132', backgroundColor: '#d1e7dd', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' },
    error: { color: '#842029', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' },
    footer: { marginTop: '20px' },
    link: { fontSize: '14px', color: '#F93D5D', textDecoration: 'none' }
};

export default EmailChangeForm;