import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Signup(){
    const navigate = useNavigate();     //遷移用
    const [name,setname] = useState('');
    const [Email,setEmail] = useState('');
    const [password,setpassword] = useState('');
    const [confi_pass,setconfi_pass] = useState('');
    const [showPass,setShowPass] = useState(false)  //falseで非表示状態、trueで表示状態
    const [showconfi_Pass,setShowconfi_Pass] = useState(false)
    const [error,setError] = useState(''); //エラーメッセージをいれる、空ならエラーなし

    const handleSubmit = (e) => {    //関数handleSubmitを作りフォーム送信情報が入ってきたら{}を実行する
        e.preventDefault();   // リロードさせない

        if(password.length < 12){
            setError("パスワードは１２文字以上にしてください");
            return;}
        if(!/[A-Z]/.test(password)){
            setError("大文字（A～Z）を入れてください");
            return;}
        if(!/[a-z]/.test(password)){ 
            setError("小文字（a～z）を入れてください");
            return;}
        if(!/[0-9]/.test(password)){
            setError("半角数字（0～9）を入れてくださいい");
            return;}
        if(!/[!@&?]/.test(password)){
            setError("記号（！＠＆？）を入れてください");
            return;}
        if(password !== confi_pass){
            setError('パスワードが一致しません');
            return;   
        }
        setError("");
        //登録成功したら遷移
        navigate('/AccountCreated');

        //確認用（ここでAPIに送るらしい）
        console.log('登録情報：',{name,Email,password});
    };

    //ここからは画面に表示する内容
    return(
        <form onSubmit={handleSubmit}>   {/* formを作成　onSubmit(フォーム送信)されたらhandleSubmitを実行 */}
            <h2>新規会員登録</h2>

            <input
                type = "text"
                placeholder = "ユーザー名"
                value = {name}  //入力フォームの表示内容をname関数の内容にする
                onChange={(e) => setname(e.target.value)}  
                    //入力欄に変更がある（(e)が教えてくれる）とonChangeが実行
                    //e.target.valueとは入力欄に入っている文字列のこと
                    //setname()でstateに保存、value={name}が更新され入力欄が最新の状態に
                required    //入力が空だと送信されない
            />
            <input
                type = "email"
                placeholder="メールアドレス"
                value = {Email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type = {showPass ? "text" : "password"}     //showPassword関数がtrueならtext,falseならpasswordで表示する
                placeholder="パスワード(大小英字、半角数字、記号（!@&?）を１つ以上含む)"
                value = {password}
                onChange={(e) => setpassword(e.target.value)}
                required
            />
            {/* パスワードの表示切替ボタン */}
            <button
                type = "button"
                onClick={() => setShowPass(!showPass)}
            >
                {showPass ? "非表示" : "表示"}
            </button>
            <input
                type = {showconfi_Pass ? "text" : "password"}
                placeholder="パスワード(確認用)"
                value = {confi_pass}
                onChange={(e) => setconfi_pass(e.target.value)}
                required
            />
            {/* 確認用パスワードの表示切替ボタン */}
            <button
                type = "button"
                onClick={() => setShowconfi_Pass(!showconfi_Pass)}
            >
                {showconfi_Pass ? "非表示" : "表示"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type = "submit">登録</button>
        </form>
    );
};