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
  const { isLoggedIn, currentUser, logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false); // 確認ボックス表示フラグ
  const [loginOut, setLoginOut] = useState(false);   // ログアウト中フラグ

  useEffect(()=> {
    if(!isLoggedIn && !loginOut){
      navigate("/login");
    }
  },[isLoggedIn,loginOut,navigate]);

  //未ログイン時に表示されない様にする
  if(!isLoggedIn && !loginOut){
    return null;
  }

  //ログアウトボタンを押すと確認ボックス表示
  const handleLogoutClick = () =>{
    setShowConfirm(true);
  }

  //はいを押したとき
  const handleConfirmYes = () => {
    logout(); //実際にログアウト
    setLoginOut(true); //ログアウト中と表示
    setShowConfirm(false); //確認ボックスを消す
    setTimeout(() => navigate("/"),5000); //5秒後にTOPページへ遷移
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
  };
  
  // return の中に、このコンポーネントが画面に表示する内容を書く
  //ログイン済みならマイページ表示
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>マイページ</h1>

      {/* ユーザーアイコンと名前 */}
      <div>
        <p><strong>お帰りなさい！   {currentUser?.name}  さん！</strong></p>
      </div>

      {/* ボタン一覧 */}
      <div>
        <h3>メニュー</h3>
        <div style={gridStyle}>
          <button  onClick={() => navigate("/VisitList")}>来店一覧</button>
          <button  onClick={() => navigate("/FavoritesList")}>お気に入り一覧</button>
          <button  onClick={() => navigate("/reset-pass")}>アカウント編集</button>
          <button  onClick={() => navigate("/HistoryList")}>閲覧履歴一覧</button>
          <button  onClick={() => navigate("/EventApplicationHistory")}>イベント申請確認</button>
          <button  onClick={() => navigate("/EventForm")}>イベント申請新規登録</button>
          <button  onClick={() => navigate("/RestaurantForm")}>店登録（仮）</button>
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
            5秒後にTOPページに戻ります</p>
          </div>
        </div>
      )}

      </div>

       {/* メインページに戻る ✕ ボタン */}
      <div style={{ marginTop: "20px" }}>
        <button
          style={closeButtonStyle}
          onClick={() => navigate("/")} // ← ここでメインページに戻る
        >
        ✕
        </button>
      </div>
    </div>
  );
}
