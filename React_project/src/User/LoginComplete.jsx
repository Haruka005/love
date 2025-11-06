import React from "react";
import { Link } from "react-router-dom";

export default function LoginComplete(){
    return(
        <div>
            <h1>ログインが完了しました</h1>
            <Link to = "/">
                <button>TOPページに戻る</button>
            </Link>
        </div>
    );
};