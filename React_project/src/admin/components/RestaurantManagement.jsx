import React, { useState } from "react";
// ▼ さきほど作成した部品を読み込む（RestaurantListは名前付きインポート {} が必要）
import RestaurantApproval, { RestaurantList } from "./RestaurantApproval";

export default function RestaurantManagement({ onStatusUpdate }) {
    const [activeTab, setActiveTab] = useState("pending");

    const tabStyle = (id) => ({
        padding: '10px 20px', 
        border: 'none', 
        borderBottom: activeTab === id ? '3px solid #f93d5d' : '3px solid transparent',
        background: 'none', 
        cursor: 'pointer', 
        fontWeight: activeTab === id ? 'bold' : 'normal', 
        color: activeTab === id ? '#f93d5d' : '#666',
        transition: 'all 0.3s ease',
    });

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <h2 style={{ paddingLeft: '15px', marginBottom: '25px' }}>飲食店管理</h2>
            
            <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', display: 'flex' }}>
                <button onClick={() => setActiveTab("pending")} style={tabStyle("pending")}>未承認</button>
                <button onClick={() => setActiveTab("approved")} style={tabStyle("approved")}>公開中</button>
                <button onClick={() => setActiveTab("hidden")} style={tabStyle("hidden")}>非公開</button>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '8px', minHeight: '300px' }}>
                {/* 未承認タブ：RestaurantApprovalコンポーネントを表示 */}
                {activeTab === "pending" && (
                    <RestaurantApproval onUpdate={onStatusUpdate} />
                )}
                
                {/* 公開中タブ：statusを 2 に修正 */}
                {activeTab === "approved" && (
                    <RestaurantList 
                        status={2} 
                        title="公開中の店舗" 
                        onStatusUpdate={onStatusUpdate} 
                    />
                )}
                
                {/* 非公開タブ：statusは 9 */}
                {activeTab === "hidden" && (
                    <RestaurantList 
                        status={9} 
                        title="非公開の店舗" 
                        onStatusUpdate={onStatusUpdate} 
                    />
                )}
            </div>
        </div>
    );
}

