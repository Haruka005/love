//管理者TOP画面
import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import UserManagement from './components/user_mg';

export default function AdminTop() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div>
      <h1>管理者ページ</h1>

      {/* タブ切り替えメニュー */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          margin: "20px 0",
        }}
      >
        {[
          { key: "users", label: "ユーザー管理" },
          { key: "events", label: "イベント管理" },
          { key: "restaurants", label: "飲食店管理" },
          { key: "site", label: "サイト管理" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "10px 15px",
              borderRadius: "25px",
              border: activeTab === tab.key ? "2px solid #f93d5d" : "1px solid #ccc",
              background: activeTab === tab.key ? "#ffe6ec" : "#fff",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* コンテンツ切り替え */}
      <div style={{ background: "#fff", borderRadius: "15px", padding: "20px" }}>
        {activeTab === "users" && <UserManagement />}
        {activeTab === "events" && <EventManagement />}
        {activeTab === "restaurants" && <RestaurantManagement />}
        {activeTab === "site" && <SiteManagement />}
      </div>
    </div>
  );
}

/* ユーザー管理 */
<UserManagement />

/* イベント管理 */
function EventManagement() {
  return (
    <div>
      <h2>イベント管理</h2>
      <p>登録済みイベントを一覧表示・編集・削除できます。</p>
      <button>＋ イベント追加</button>
    </div>
  );
}

/* 飲食店管理 */
function RestaurantManagement() {
  return (
    <div>
      <h2>🍔 飲食店管理</h2>
      <p>お店情報の登録・編集・削除が行えます。</p>
      <button>＋ 店舗を追加</button>
    </div>
  );
}

/* サイト管理 */
function SiteManagement() {
  return (
    <div>
      <h2>サイト管理</h2>
      <label>
        トップページメッセージ：
        <input
          type="text"
          placeholder="例：登別の魅力を発信中！"
          style={{ width: "80%", marginLeft: "10px" }}
        />
      </label>
      <br /><br />
      <button>💾 保存</button>
    </div>
  );
}
