//マイページ
import { useNavigate } from "react-router-dom";

// このファイルで定義するコンポーネント（部品）の名前は MyPage
export default function MyPage(){
     const navigate = useNavigate();

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
    return(
        
        // 全体を <div> で囲むことで、複数の要素をまとめて返すことができる
         <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center", fontFamily: "sans-serif" }}>
        <h1>マイページ</h1>

    {/*ユーザーアイコンと名前*/}
    <div>
    <img src="https://via.placeholder.com/100"
    alt="ユーザーアイコン" 
    style={avatarStyle}
  />
     <p><strong>ユーザー名: のぼりべつ赤鬼代表</strong></p>
    </div>    
    {/*ボタン一覧*/}
    <div>
        <h3>メニュー</h3>
         <div style={gridStyle}>
          <button style={buttonStyle} onClick={() => navigate("/VisitList")}>来店一覧</button>
           <button style={buttonStyle} onClick={() => navigate("/FavoritesList")}>お気に入り一覧</button>
           {/*reset-passと紐づけ↓*/}
          <button style={buttonStyle} onClick={() => navigate("/reset-pass")}>アカウント編集 </button>
         <button style={buttonStyle} onClick={() => navigate("/HistoryList")}>閲覧履歴一覧</button>
          <button style={buttonStyle} onClick={() => navigate("/EventApplicationHistory")}>イベント申請確認</button>
          <button style={buttonStyle}>イベント新規登録</button>
        </div>
    </div>

    {/*閉じるボタン*/}
    <div>
       <button style={closeButtonStyle}>✕</button>
    </div>
</div>

    );
}
