//メールアドレス変更完了画面
import { useNavigate } from 'react-router-dom';

const EmailChangeSuccess = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.icon}>✓</div>
                <h2 style={styles.title}>メールアドレスの変更完了</h2>
                <p style={styles.text}>
                    メールアドレスの変更が正常に完了しました。<br />
                    次回から、新しいメールアドレスでログインしてください。
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
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa'
    },
    card: {
        width: '100%',
        maxWidth: '450px',
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        textAlign: 'center'
    },
    icon: {
        fontSize: '50px',
        color: '#fff',
        backgroundColor: '#F93D5D',
        width: '80px',
        height: '80px',
        lineHeight: '80px',
        borderRadius: '50%',
        margin: '0 auto 20px'
    },
    title: { color: '#333', marginBottom: '20px' },
    text: { color: '#666', fontSize: '15px', lineHeight: '1.6', marginBottom: '30px' },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#F93D5D',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer'
    }
};

export default EmailChangeSuccess;