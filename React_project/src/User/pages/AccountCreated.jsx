import { useLocation, Link } from "react-router-dom";

export default function AccountCreated() {
    const location = useLocation();
    const { name, email } = location.state || {};

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 style={{ color: '#F93D5D' }}>Loveりべつ</h2>
            
            <h1>仮会員登録が完了しました</h1>
            
            <p>登録されたメールアドレスに認証リンクが送信されました。</p>
            <p>60分以内に認証を完了してください。</p>

            <div style={{ marginTop: '20px' }}>
                <Link to="/">
                    <button>TOPページに戻る</button>
                </Link>
            </div>
        </div>
    );
}