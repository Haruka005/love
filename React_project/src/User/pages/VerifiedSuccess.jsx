import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//メール認証成功画面
const VerifiedSuccess = () => {
  const navigate = useNavigate();

  // 5秒後に自動的にログインページへ飛ばす
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.icon}>✅</h1>
        <h2 style={styles.title}>メール認証が完了しました！</h2>
        <p style={styles.text}>
          ご登録ありがとうございます。アカウントが有効になりました。<br />
          5秒後にログイン画面へ移動します。
        </p>
        <button 
          onClick={() => navigate('/login')} 
          style={styles.button}
        >
          ログイン画面へ
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f9f9f9' },
  card: { textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '400px' },
  icon: { fontSize: '64px', marginBottom: '20px' },
  title: { color: '#333', marginBottom: '10px' },
  text: { color: '#666', lineHeight: '1.6', marginBottom: '25px' },
  button: { backgroundColor: '#f53003', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }
};

export default VerifiedSuccess;