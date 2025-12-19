// src/App.js

import { BrowserRouter, Routes, Route } from "react-router-dom";
//import { AuthContext } from "./contexts/AuthContext";
import React, { useState } from "react";
import { AuthProvider } from "./User/AuthContext";
import "./App.css";

// 各ページコンポーネントをインポート
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
//import ShopForm from "./User/ShopForm";
import EventDetail from "./User/EventDetail"; 
import RestaurantDetail from "./User/RestaurantDetail"; 

import AdminTop from "./admin/AdminTop";
import RestaurantForm from './User/RestaurantForm';

import AdminLogin from "./admin/components/AdminLogin"; // ★ 追加！

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login-complete" element={<LoginComplete />} />
          <Route path="/AccountCreated" element={<AccountCreated />} />
          <Route path="/ReportForm" element={<ReportForm />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/reset-pass" element={<ResetPass />} />
          <Route path="/VisitList" element={<VisitList />} />
          <Route path="/FavoritesList" element={<FavoritesList />} />
          <Route path="/HistoryList" element={<HistoryList />} />
          <Route path="/EventApplicationHistory" element={<EventApplicationHistory />} />
          <Route path="/EventForm" element={<EventForm />} />
          <Route path="/RestaurantForm" element={<RestaurantForm />} />
          <Route path="/AdminTop" element={<AdminTop />} />

          <Route path="/admin/login" element={<AdminLogin />} /> {/* ★ 管理者ログインページ追加 */}

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
