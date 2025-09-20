// src/App.js

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 各ページコンポーネントをインポート
import MainPage from "./User/MainPage";
import Login from "./User/Login";
import Signup from "./User/Signup";
import LoginComplete from "./User/LoginComplete";
import AccountCreated from "./User/AccountCreated";
import ReportForm from "./User/ReportForm";
import MyPage from "./User/MyPage";
import RestaurantDetail from "./User/RestaurantDetail"
import EventDitail from "./User/EventDetail"
import Inquiry from "./User/Inquiry"
import ResetPass from "./User/reset-pass";
import VisitList from "./User/VisitList";

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

        {/* 通報ページ */}
        <Route path="/ReportForm" element={<ReportForm />} />

        {/* マイページ */}
        <Route path="/MyPage" element={<MyPage />} />

        {/* 飲食店詳細 */}
        <Route path="/RestaurantDetail" element={<RestaurantDetail />} />

        {/* イベント詳細 */}
        <Route path="/EventDetail" element={<EventDitail />} />

        {/* お問い合わせ*/}
        <Route path="/Inquiry" element={<Inquiry />} />

        {/*パスワード再設定ページ*/}
        <Route path="/reset-pass" element={<ResetPass/>}/>

        {/*来店一覧*/}
        <Route path="/visit-list" element={<VisitList />} />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
