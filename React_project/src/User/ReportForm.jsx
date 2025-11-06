//通報画面

import React, { useState } from "react";

export default function ReportForm(){

    const [formData,setData] = useState({
        name:"", //名前
        email:"", //メールアドレス
        reason:"", //通報理由

    })

    //入力欄に文字が入るたびに呼ばれる関数
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData({
            ...formData, //今のformDataをそのままコピーするという意味
            [name]:value, //nameキーを新しい値に置き換える
        });
    };

    //送信されたときに呼ばれる関数
    const handleSubmit = (e) => {
        e.preventDefault(); //ページのリロードを防ぐ
        console.log("送信データ：",formData); //送信内容を開発者ツールに表示
        alert("通報が送信されました。")  //後に変更する
    };

    //ブラウザに表示される内容
    return(
        <form className="report-form" onSubmit={handleSubmit}>
            <h2>通報フォーム</h2>

            {/*入力欄のラベルを作るタグ*/}
            <label>
                名前（任意）:
                <input
                    type = "text"
                    name = "name" //この入力欄の名前
                    value = {formData.name}  //入力欄の値をform.nameとして扱うよ
                    onChange={handleChange}  //入力するたびにhandleChangeを呼ぶよ
                />
            </label>

            <label>
                メールアドレス:
                <input
                    type = "email"
                    name = "email" //この入力欄の名前
                    value = {formData.email}  //入力欄の値をform.emailとして扱うよ
                    onChange={handleChange}  //入力するたびにhandleChangeを呼ぶよ
                    required //必須項目とする
                />
            </label>

            <label>
                理由(詳細に記入してください):
                <textarea
                    name = "reson" //この入力欄の名前
                    value = {formData.reason}  //入力欄の値をform.emailとして扱うよ
                    onChange={handleChange}  //入力するたびにhandleChangeを呼ぶよ
                    required //必須項目とする
                    placeholder={"例)-2020/02/04 開催の〇〇のイベントページに不適切な画像が掲載されていた"}
                />
            </label>

            <button type = "submit">送信</button>
        </form>

    );
}