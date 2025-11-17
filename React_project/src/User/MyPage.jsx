// マイページ

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
//ログイン状態を確認する
import { useAuth } from "./AuthContext";

// このファイルで定義するコンポーネント（部品）の名前は MyPage
export default function MyPage() {
  const navigate = useNavigate();
  //ここでログイン状態を取得する
  const {isLoggedIn} =useAuth();

  useEffect(()=> {
    if(!isLoggedIn){
      navigate("/login");
    }
  },[isLoggedIn,navigate]);

//未ログイン時に表示されない様にする
  if(!isLoggedIn){
    return null;
  }

  // グリッドレイアウト用のスタイル
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr", // 2列
    gap: "10px", // ボタン間の余白
    marginTop: "20px",
    marginBottom: "20px",
  };

  // ボタンの共通スタイル
  const buttonStyle = {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#eee",
    cursor: "pointer",
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

  // ユーザーアイコンのスタイル（円形＋枠）
  const avatarStyle = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    border: "3px solid #ccc",
    padding: "5px",
    backgroundColor: "#fff",
  };

  
  // return の中に、このコンポーネントが画面に表示する内容を書く
  //ログイン済みならマイページ表示
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>マイページ</h1>

      {/* ユーザーアイコンと名前 */}
      <div>
        <img
          src="/images/yuru-oni.png"
          alt="ユーザーアイコン"
          style={avatarStyle}
        />
        {/*→currentUser.nameを使用すればログインユーザーに応じて
          動的にできる*/}
        <p><strong>ユーザー名: のぼりべつ赤鬼代表</strong></p>
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
          <button  onClick={() => navigate("/")}>ログアウト</button>
          


        </div>
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
