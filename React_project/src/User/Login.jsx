//ログイン画面

import { useState } from "react";   //Reactの中からuseStateっていう便利機能を取りだして使うよっていう宣言
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext"; 

export default function Login(){    //外に持って行ってOKなLoginっていう名前の部品作るよっていう宣言
  const [email,setEmail] = useState('');  //emailっていう変数用意して最初は空にしとく、メールの内容をリアルタイムで保存できる
  const [password,setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const{login}=useAuth();

  const exitButton = {
    padding: '8px 16px',
    fontSize: '0.9rem',
    fontWeight: '500',
    backgroundColor: '#ffffff',
    color: '#f93d5d', 
    border: '1px solid #f93d5d', 
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'block', 
    margin: '30px auto 0 auto', 
  }
  const buttonWrapperStyle = {
    marginTop: "30px",
    display: "block", 
    width: "100%",
    textAlign: "center", // ボタンを中央揃えにする
    position: "static",
    right: 'auto', 
    top: 'auto',
  };

  console.log("送信するトークン:", localStorage.getItem('token'));
  console.log("送信するヘッダー:", {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  });

  const handleSubmit = async(e) => {   //handle＝操作、submit＝送信された時にやること(e)はイベント情報が入っている（いつどのキーがクリックされた？）=>とはこれ(送信操作)がされたら次の処理を実行して！ということ
      e.preventDefault(); //フォーム送信時は自動でリロードされてしまい、入力内容が消えてしまう。そのためページのリロードを防ぐ関数を用いる
      setError('');

  try {
    //両方の環境で動く書き方らしい
    const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

    const data = await response.json();
    //ログ
    console.log("response:", response); 
    console.log("data:", data);


    if (response.ok) {
      //トークンをlocalstorage（ブラウザの保存箱）に保存
      //.setItemは保存命令引数は名前と保存する値（サーバから返ってきたdataの中のtoken）
      localStorage.setItem('token', data.token);

        login({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        },data.token
      );
        navigate('/MyPage');
      } else {
        setError(data.message || 'ログインに失敗しました');
      }
    } catch (err) {
      console.error('通信エラー:', err);
      setError('サーバーに接続できませんでした');
    }
  };
  
    return(     //ここからどんな見た目にするか書く
      <div className="form-container">
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
              onChange={(e) => setPassword(e.target.value)}
              required
          />
          
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">ログイン</button> {/*フォームの送信ボタン、押したらhandleSubmitが動く*/}

          <div style={{ buttonWrapperStyle }}>
            <button
              style={exitButton}
              onClick={() => navigate("/")} // ← ここでメインページに戻る
            >
              TOPページへ
            </button>
          </div>
        </form>

      </div>

      
      
    );
}