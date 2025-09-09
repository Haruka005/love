//ログイン画面
import { useState } from "react";   //Reactの中からuseStateっていう便利機能を取りだして使うよっていう宣言

export default function Login(){    //外に持って行ってOKなLoginっていう名前の部品作るよっていう宣言

    const [email,setEmail] = useState('');  //emailっていう変数用意して最初は空にしとく、メールの内容をリアルタイムで保存できる
    const [password,setpassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = (e) => {   //handle＝操作、submit＝送信つまり送信された時にやること(e)はイベント情報が入っている（いつどのキーがクリックされた？）=>とはこれ(送信操作)がされたら次の処理を実行して！ということ
        e.preventDefault(); //フォーム送信時は自動でリロードされてしまい、入力内容が消えてしまう。そのためページのリロードを防ぐ関数を用いる

        if(email.trim() !== "" && password.trim() !== ""){
            navigate('/LoginComplete')
        }else{
            setError("メールアドレスまたはパスワードが違います");
        }

        console.log('ログイン情報：',{email,password});     //開発者用画面(F12)で表示される。無くてもいいがちゃんと動いてるか確認ができるから便利
    };

    return(     //ここからどんな見た目にするか書く
        <form onSubmit = {handleSubmit}>    {/*formは入力フォームを作るタグでonSubmitはこのフォームが送信されたときという意味={handleSubmit}でこのフォームを送信したときにhandleSubmitを実行して！という意味 */}
            <h2>ログイン</h2> 
            <input 
                type="email"    //この入力欄はメールアドレス専用と宣言(入力ミスとかも見てくれる)
                placeholder="メールアドレス"    //入力欄に薄く表示される文字、入力したら消える
                value={email}   //reactが持ってるemail関数の値を表示してねという意味入力した値がリアルタイムで入力欄に表示、これがないとreact側が入力内容を保持できない
                onChange={(e) => setEmail(e.target.value)}  //入力されたらReactの状態を更新してね！の意味。e=入力されたという情報、setEmail()の中にe.taeget.value（入力された文字を取り出す）を入れることでEmail変数の中身が入力された内容に変化する
                required    //空はNGの意味（ブラウザが自動でエラーメッセージを表示する）Submitできない
            />
            <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                required
            />
            
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit">ログイン</button> {/*フォームの送信ボタン、押したらhandleSubmitが動く*/}
        </form>
    );
}