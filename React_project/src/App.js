// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 各ページコンポーネントをインポート
import MainPage from "./User/MainPage";
import Login from "./User/Login";
import Signup from "./User/Signup";
import LoginComplete from "./User/LoginComplete";
import AccountCreated from "./User/AccountCreated";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* トップページ */}
        <Route path="/" element={<MainPage />} />

        {/* ログインページ */}
        <Route path="/login" element={<Login />} />

        {/* サインアップページ */}
        <Route path="/signup" element={<Signup />} />

        {/* ログイン完了ページ */}
        <Route path="/login-complete" element={<LoginComplete />} />

        {/* アカウント作成完了ページ */}
        <Route path="/account-created" element={<AccountCreated />} />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
