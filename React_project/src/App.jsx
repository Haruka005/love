// src/App.js

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

// ▼ 一般ユーザー用ページ
import MainPage from "./User/MainPage";
import Login from "./User/Login";
import Signup from "./User/Signup";
import LoginComplete from "./User/LoginComplete";
import AccountCreated from "./User/AccountCreated";
import ReportForm from "./User/ReportForm";
import MyPage from "./User/MyPage";
import ResetPass from "./User/reset-pass";
import VisitList from "./User/VisitList";
import FavoritesList from "./User/FavoritesList";
import HistoryList from "./User/HistoryList";
import EventApplicationHistory from "./User/EventApplicationHistory";
import EventForm from "./User/EventForm";
import EventDetail from "./User/EventDetail"; 
import RestaurantDetail from "./User/RestaurantDetail";
import VerifiedSuccess from "./User/VerifiedSuccess.jsx"; 

// ▼ 管理者用ページ
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminTop from "./admin/AdminTop";

import RestaurantForm from './User/RestaurantForm';
import Header from "./User/components/Header";
import Footer from "./User/components/Footer";

// 管理者用：イベント編集画面をインポート
import EventEdit from "./admin/EventEdit"; 
//店編集画面
import RestaurantEdit from "./admin/RestaurantEdit";

//管理者用店登録
import RestaurantApproval from "./admin/RestaurantApproval.jsx";


function App() {

  return (
    <AuthProvider>
    <BrowserRouter>

      <Routes>
        {/* トップページ */}
        <Route path="/" element={<MainPage />} />

        {/* ログインページ */}
        <Route path="/login" element={<Login />} />

        {/* サインアップページ */}
        <Route path="/signup" element={<Signup />} />

        {/* メール認証完了ページ */}
        <Route path="/VerifiedSuccess" element={<VerifiedSuccess />} />

        {/* ログイン完了ページ */}
        <Route path="/login-complete" element={<LoginComplete />} />

        {/* アカウント作成完了ページ */}
        <Route path="/AccountCreated" element={<AccountCreated />} />

        {/* 通報ページ */}
        <Route path="/ReportForm" element={<ReportForm />} />

        {/* マイページ */}
        <Route path="/MyPage" element={<MyPage />} />

        {/* 飲食店詳細 */}
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />

        {/* イベント詳細 */}
        <Route path="/events/:id" element={<EventDetail />} />

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
        <Route path="/RestaurantForm" element={<RestaurantForm />} />

        {/*管理者TOP*/}
        <Route path="/AdminTop" element={<AdminTop />} />

        {/*管理者ログイン*/}
        <Route path="/Adminlogin" element={<AdminLogin />} />

        {/* 【管理者用】イベント編集画面のルートを追加 */}
        <Route path="/EventEdit/:id" element={<EventEdit />} />

        {/*管理者用　店舗申請承認画面 */}
        <Route path="/RestaurantApproval" element={<RestaurantApproval />} />

        {/*飲食店編集画面 */}
       <Route path="/RestaurantEdit/:id" element={<RestaurantEdit />} />


      </Routes>    
     </BrowserRouter>
     </AuthProvider>
  );
}

export default App;

