import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import VisitList from "./User/VisitList";
import FavoritesList from "./User/FavoritesList";
import HistoryList from "./User/HistoryList";
import EventApplicationHistory from "./User/EventApplicationHistory";
import EventForm from "./User/EventForm";
import EventDetail from "./User/EventDetail";
import RestaurantDetail from "./User/RestaurantDetail";
import VerifiedSuccess from "./User/VerifiedSuccess.jsx";
import ForgotPassword from "./User/ForgotPassword.jsx";
import ResetPassword from "./User/ResetPassword.jsx";
import EmailChangeForm from "./User/EmailChangeForm.jsx";
import EmailChangeConfirm from "./User/EmailChangeConfirm.jsx";
import EmailChangeSuccess from "./User/EmailChangeSuccess.jsx";
import EventRegistrationSuccess from "./User/EventRegistrationSuccess.jsx";
import EventRegistrationError from "./User/EventRegistrationError.jsx";
import RestaurantRegistrationSuccess from "./User/RestaurantRegistrationSuccess";
import RestaurantRegistrationError from "./User/RestaurantRegistrationError";
import RestaurantForm from "./User/RestaurantForm"; // ✅ 追加済み

// ▼ 管理者用ページ
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminTop from "./admin/AdminTop";
import EventEdit from "./admin/EventEdit";
import RestaurantEdit from "./admin/RestaurantEdit";
import RestaurantApproval from "./admin/RestaurantApproval.jsx";
import UserManagement from "./admin/components/user_mg"; // ✅ 修正済みパス

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const logAccess = async () => {
      try {
        const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
        const token = localStorage.getItem("token") || localStorage.getItem("admintoken");

        await fetch(`${API_BASE}/log-access`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            url: location.pathname,
          }),
        });
      } catch (error) {
        console.error("アクセスログ送信エラー:", error);
      }
    };

    logAccess();
  }, [location]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AnalyticsTracker />
        <Routes>
          {/* ▼ 一般ユーザー向けルート */}
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/VerifiedSuccess" element={<VerifiedSuccess />} />
          <Route path="/login-complete" element={<LoginComplete />} />
          <Route path="/AccountCreated" element={<AccountCreated />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/password-reset" element={<ResetPassword />} />
          <Route path="/EmailChangeForm" element={<EmailChangeForm />} />
          <Route path="/EmailChangeConfirm" element={<EmailChangeConfirm />} />
          <Route path="/email-change-success" element={<EmailChangeSuccess />} />
          <Route path="/ReportForm" element={<ReportForm />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/VisitList" element={<VisitList />} />
          <Route path="/FavoritesList" element={<FavoritesList />} />
          <Route path="/HistoryList" element={<HistoryList />} />
          <Route path="/EventApplicationHistory" element={<EventApplicationHistory />} />
          <Route path="/EventForm" element={<EventForm />} />
          <Route path="/event-registration-success" element={<EventRegistrationSuccess />} />
          <Route path="/event-registration-error" element={<EventRegistrationError />} />
          <Route path="/RestaurantForm" element={<RestaurantForm />} />
          <Route path="/restaurant-registration-success" element={<RestaurantRegistrationSuccess />} />
          <Route path="/restaurant-registration-error" element={<RestaurantRegistrationError />} />

          {/* ▼ 管理者向けルート */}
          <Route path="/AdminTop" element={<AdminTop />} />
          <Route path="/Adminlogin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/EventEdit/:id" element={<EventEdit />} />
          <Route path="/RestaurantEdit/:id" element={<RestaurantEdit />} />
          <Route path="/RestaurantApproval" element={<RestaurantApproval />} />
          <Route path="/admin" element={<UserManagement />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
