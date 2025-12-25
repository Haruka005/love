//新規登録画面
import { useLocation,Link } from "react-router-dom";



export default function AccountCreated(){
    const location = useLocation();
    const { name,email }=location.state || {};

    
    return(
        <div>
            <h1>仮会員登録が完了しました</h1>
           <p>登録されたメールアドレスに認証リンクが送信されました。</p>
           <p>60分以内に認証を完了してください。</p>
            <Link to = "/">
                <button>TOPページに戻る</button>
            </Link>
        </div>
    );
}