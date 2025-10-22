//新規登録画面
import React from "react";
import { useLocation,Link } from "react-router-dom";



export default function AccountCreated(){
    const location = useLocation();
    const { name,email }=location.state || {};

    
    return(
        <div>
            <h1>会員登録が完了しました</h1>
            {name && <p>ユーザー名:{name}</p>}
            {email && <p>メールアドレス:{email}</p>}
            <Link to = "/">
                <button>TOPページに戻る</button>
            </Link>
        </div>
    );
}