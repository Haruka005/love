import React from 'react';  //reactを使うための宣言
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';  //画面遷移をする道具を使う宣言
import Login from './Login';  //遷移先をインポート
import Signup from './Signup';
import LoginComplete from './LoginComplete';
import AccountCreated from './AccountCreated';

function App() {  //App関数を作る
  return (  //画面の表示内容を以下に記述
    <BrowserRouter>   {/*全体を遷移できる道具で管理する*/}
      <Routes>  {/*URLに応じてどのページを表示するかを決めるブロック*/}
        {/* トップページ */}
        <Route path="/" element={   //'/'は最初に開くURLのことelementはその中身のこと

          <div>   {/*パスが最初のURLだったら以下を表示するよ！*/}
            <h1>トップページ</h1>
            
            <Link to="/login">
              <button>ログインページへ</button>
            </Link>

            <Link to = "/Signup">
              <button>新規会員登録</button>
            </Link>

          </div>

        } />

        {/* ログインページ */}
        <Route path="/login" element={<Login />} />   {/*"/Login"にアクセスしたらLoginページを表示するよ！*/}

        {/* ログイン完了ページ */}
        <Route path = "/LoginComplete" element = {<LoginComplete/>} />

        {/* 新規会員登録 */}
        <Route path = "/Signup" element = {<Signup/>} />

        {/* 会員登録完了ページ */}
        <Route path = "/AccountCreated" element = {<AccountCreated/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
