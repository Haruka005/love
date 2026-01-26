import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";


// ▼ 一般ユーザー用ページ (src/User/pages)
import MainPage from "./User/pages/MainPage.jsx";
import Login from "./User/pages/Login.jsx";
import Signup from "./User/pages/Signup.jsx";
import LoginComplete from "./User/pages/LoginComplete.jsx";
import AccountCreated from "./User/pages/AccountCreated.jsx";
import ReportForm from "./User/pages/ReportForm.jsx";
import MyPage from "./User/pages/MyPage.jsx";
import EventApplicationHistory from "./User/pages/EventApplicationHistory.jsx";
import EventForm from "./User/pages/EventForm.jsx";
import EventDetail from "./User/pages/EventDetail.jsx";
import RestaurantDetail from "./User/pages/RestaurantDetail.jsx";
import VerifiedSuccess from "./User/pages/VerifiedSuccess.jsx";
import ForgotPassword from "./User/pages/ForgotPassword.jsx";
import ResetPassword from "./User/pages/ResetPassword.jsx";
import EmailChangeForm from "./User/pages/EmailChangeForm.jsx";
import EmailChangeConfirm from "./User/pages/EmailChangeConfirm.jsx";
import EmailChangeSuccess from "./User/pages/EmailChangeSuccess.jsx";
import EventRegistrationSuccess from "./User/pages/EventRegistrationSuccess.jsx";
import EventRegistrationError from "./User/pages/EventRegistrationError.jsx";
import RestaurantRegistrationSuccess from "./User/pages/RestaurantRegistrationSuccess.jsx";
import RestaurantRegistrationError from "./User/pages/RestaurantRegistrationError.jsx";
import RestaurantForm from "./User/pages/RestaurantForm.jsx";

// ▼ 管理者用ページ (src/admin/pages)
import AdminLogin from "./admin/pages/AdminLogin.jsx";
import AdminTop from "./admin/pages/AdminTop.jsx";
import EventEdit from "./admin/pages/EventEdit.jsx";
import RestaurantEdit from "./admin/pages/RestaurantEdit.jsx";

// ▼ 管理者用コンポーネント
import RestaurantApproval from "./admin/components/RestaurantApproval.jsx";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const logAccess = async () => {
      try {
        const envUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
        const API_BASE = envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
        
        const token = localStorage.getItem("usertoken") || localStorage.getItem("admintoken");

        const userStr = localStorage.getItem("user");
        let userId = null;
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            userId = user.id;
          } catch (e) {
            console.error("ユーザー情報のパースに失敗しました", e);
          }
        }

        await fetch(`${API_BASE}/log-access`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            url: location.pathname,
            user_id: userId,
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
          {/* UserManagement, adminルートは削除しました */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;