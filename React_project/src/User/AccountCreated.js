import React from "react";
import { Link } from "react-router-dom";

export default function AccountCreated(){
    return(
        <div>
            <h1>会員登録が完了しました</h1>
            <Link to = "/">
                <button>TOPページに戻る</button>
            </Link>
        </div>
    );
};