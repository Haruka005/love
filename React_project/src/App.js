// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import React, { useState } from "react";

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
import FavoritesList from "./User/FavoritesList"; 
import HistoryList from "./User/HistoryList"; 
import EventApplicationHistory from "./User/EventApplicationHistory";
import EventForm from "./User/EventForm";
import ShopForm from "./User/ShopForm";


function App() {
  // 仮のログインユーザー情報（本番ではログイン処理と連携）
  const [currentUser] = useState({
    id: 123,
    has_image_folder: 0,
  });

  return (
    //ReactのContext APIを使って「ログインユーザー情報（currentUser）」をアプリ全体に共有するための仕組みらしい
    <AuthContext.Provider value={currentUser}>
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
        <Route path="/AccountCreated" element={<AccountCreated />} />

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
        <Route path="/VisitList" element={<VisitList />} />

        {/* お気に入り一覧ページ */}
        <Route path="/FavoritesList" element={<FavoritesList />} />
        
        {/*閲覧履歴一覧*/}
        <Route path="/HistoryList" element={<HistoryList />} />

       {/*イベント親戚確認 */}
        <Route path="/EventApplicationHistory" element={<EventApplicationHistory />} />

       {/*イベント新規登録 */}
        <Route path="/EventForm" element={<EventForm />} />

        {/*イベント新規登録 */}
        <Route path="/ShopForm" element={<ShopForm />} />

      </Routes>
    </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
