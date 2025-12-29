// マイページ

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
//ログイン状態を確認する
import { useAuth } from "../contexts/AuthContext";

// このファイルで定義するコンポーネント（部品）の名前は MyPage
export default function MyPage() {
  const navigate = useNavigate();
  //ここでログイン状態を取得する
  const { isLoggedIn, user, logout,loading } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false); // 確認ボックス表示フラグ
  const [loginOut, setLoginOut] = useState(false);   // ログアウト中フラグ

  const token = localStorage.getItem("usertoken");

  useEffect(()=> {
    if(!isLoggedIn && !loginOut && !loading){
      navigate("/login");
    }
  },[isLoggedIn,loginOut,loading,navigate]);

  //ローディング中
  if(loading){
      // 認証チェックが終わるまで何も表示しない
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>読み込み中...</p>
        </div>
      );
  }

  //ログアウトボタンを押すと確認ボックス表示
  const handleLogoutClick = () =>{
    setShowConfirm(true);
  }

  //はいを押したとき
  const handleConfirmYes = async () => {
    setLoginOut(true); //ログアウト中と表示
    setShowConfirm(false); //確認ボックスを消す

    try { 
      //サーバー側にログアウトを依頼
      await fetch("/api/logout",{
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      localStorage.removeItem("usertoken");
      logout();//フロント側のユーザー情報削除
      console.log("ログアウト成功");
    }catch(err){
      console.error("ログアウト通信エラー",err);
    }

    setTimeout(() => navigate("/"),500); //0.5秒後にTOPページへ遷移

  };

  //いいえを押したとき
  const handleConfirmNo = () => setShowConfirm(false); //ボックスを閉じる

  // グリッドレイアウト用のスタイル
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr", // 2列
    gap: "10px", // ボタン間の余白
    marginTop: "20px",
    marginBottom: "20px",
  };

  // 閉じるボタンのスタイル（丸くてグレー）
  const closeButtonStyle = {
    backgroundColor: "#eee",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    fontSize: "20px",
    cursor: "pointer",
    display: "block", 
    margin: "20px auto",
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 0, 
    lineHeight: 1, 
  };
  
  // return の中に、このコンポーネントが画面に表示する内容を書く
  //ログイン済みならマイページ表示
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>マイページ</h1>

      {/* ユーザーアイコンと名前 */}
      <div>
        <p><strong>お帰りなさい！   {user?.name}  さん！</strong></p>
      </div>

      {/* ボタン一覧 */}
      <div>
        <h3>メニュー</h3>
        <div style={gridStyle}>
         {/* <button  onClick={() => navigate("/VisitList")}>来店一覧</button>*/}
         {/* <button  onClick={() => navigate("/FavoritesList")}>お気に入り一覧</button>*/}
          <button  onClick={() => navigate("/reset-pass")}>アカウント編集</button>
          <button  onClick={() => navigate("/HistoryList")}>閲覧履歴一覧</button>
          <button  onClick={() => navigate("/EventApplicationHistory")}>登録・申請確認</button>
          <button  onClick={() => navigate("/EventForm")}>イベント申請新規登録</button>
          <button  onClick={() => navigate("/RestaurantForm")}>店登録</button>
          {!loginOut && <button  onClick={handleLogoutClick}>ログアウト</button>}

        </div>

        {/* 確認ボックス */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>本当にログアウトしますか？</p>
            <button onClick={handleConfirmYes} style={{ marginRight: "10px" }}>はい</button>
            <button onClick={handleConfirmNo}>いいえ</button>
          </div>
        </div>
      )}

      {/* ログアウト中表示 */}
      {loginOut && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>ログアウト中です...<br />
            TOPページに戻ります</p>
          </div>
        </div>
      )}

      </div>

      {/* メインページに戻る ✕ ボタン */}
    
      <button
        style={closeButtonStyle}
        onClick={() => navigate("/")} // ← ここでメインページに戻る
      >
      ✕
      </button>
      
    </div>
  );
}
