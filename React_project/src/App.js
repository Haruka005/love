// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 各ページコンポーネントをインポート
import MainPage from "./MainPage";
import Login from "./Login";
import Signup from "./Signup";
import LoginComplete from "./LoginComplete";
import AccountCreated from "./AccountCreated";

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
