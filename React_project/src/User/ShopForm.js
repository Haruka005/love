// Reactライブラリから useState（状態管理）を読み込む
import React, { useState } from "react";

// React Router の useNavigate（ページ遷移用）を読み込む
import { useNavigate } from "react-router-dom";

// 店舗情報登録フォームのコンポーネントを定義（関数型コンポーネント）
function ShopForm() {
  // ページ遷移に使う関数。navigate("/MyPage") でマイページに移動できる
  const navigate = useNavigate();

  // useStateを使ってフォームの入力状態を管理する
  const [formData, setFormData] = useState({
    topimages:[null],   //topのの画像
    name: "",           // 店名
    headline: "",       // 見出し（キャッチコピー）
    access: "",         // アクセス情報（駅から何分など）
    description: "",    // 外観・内観の説明
    url: "",            // ホームページURL
    comment: "",        // コメント（ユーザーの声など）
    images: [null, null, null], // 画像3枚（外観・内観など）
  });

  // 入力欄が変更されたときに呼ばれる関数
  const handleChange = (e) => {
    const { name, value } = e.target; // 入力欄のname属性とvalueを取得
    setFormData((prev) => ({
      ...prev,               // 既存のformDataをコピー
      [name]: value,         // 該当項目だけ新しい値に更新
    }));
  };


  // 画像が選択されたときに呼ばれる関数
  const handleImageChange = (index, file) => {
    const newImages = [...formData.images]; // 画像配列をコピー
    newImages[index] = file;                // 指定された位置に新しい画像をセット
    setFormData((prev) => ({
      ...prev,
      images: newImages,                    // 更新した画像配列を保存
    }));

      //ここにフォルダを作成する処理を追加











      





  };

  //TOP画像挿入
  const handleTopImageChange = (index, file) => {
  const newTopImages = [...formData.topimages];
  newTopImages[index] = file;
  setFormData((prev) => ({
    ...prev,
    topimages: newTopImages,
  }));
};

  // 申請ボタンが押されたときの処理（今はアラート表示のみ）
  const handleSubmit = () => {
    alert("店舗情報を送信しました");
    // ここにAPI送信処理を追加する予定
  };

  {/* トップ画像アップロード欄 */}
  <div style={{ marginBottom: "20px" }}>
    <label>トップ画像（1枚）</label><br />
    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleTopImageChange(0, e.target.files[0])}
      style={{ display: "block", marginBottom: "10px" }}
    />

   {/* プレビュー表示 */}
  {formData.topimages[0] && (
    <img
      src={URL.createObjectURL(formData.topimages[0])}
      alt="トップ画像プレビュー"
      style={{ width: "100%", maxHeight: "500px", objectFit: "cover", borderRadius: "8px" }}
    />
  )}
</div>


  // JSX（ReactのHTMLのような構文）を返す
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto",position:"relativ" }}>
    
      {/*TOP画像表示エリア*/}
      <div style={{
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto 20px",
            height: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            overflow: "hidden"
      }}>


    {formData.topimages[0] ? (
    <img
      src={URL.createObjectURL(formData.topimages[0])}
      alt="アップロードされたトップ画像"
      style={{
        width: "100%",
        height: "auto",
        objectFit: "cover",
        borderRadius: "0px"
      }}
    />
  ) : (
        <img
          src="/images/229.png"
          alt="登別トップ画面"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "0px"
          }}
        />
        )}
      </div>
      
      {/* ✕ボタン：マイページに戻る */}
      <button
        onClick={() => navigate("/MyPage")} // マイページに遷移する
        style={{
          position: "absolute",     // 親divを基準に左上に配置
          top: "10px",
          left: "10px",
          backgroundColor: "#eee",  // 薄いグレー背景
          borderRadius: "50%",      // 丸型にする
          width: "40px",
          height: "40px",
          fontSize: "20px",
          cursor: "pointer",        // ポインター表示
        }}
      >
        ✕
      </button>


      {/* TOP画像選択欄（1枚） */}
      <div style={{ marginBottom: "10px" }}>
        <label>TOP画像選択</label>
            <input
              type="file"
              accept="topimages"
              onChange={(e) => handleTopImageChange(0, e.target.files[0])}
               style={{ marginBottom: "10px" }}
            />
          </div>

      {/* ページタイトル */}
      <h2 style={{ textAlign: "center" }}>店舗情報登録</h2>

      {/* 店名入力欄 */}
      <div style={{ marginBottom: "10px" }}>
        <label>店名</label><br />
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{ width: "100%" }}
        />
      </div>

      {/* 見出し（キャッチコピー）入力欄 */}
      <div style={{ marginBottom: "10px" }}>
        <label>見出し</label><br />
        <textarea
          name="headline"
          value={formData.headline}
          onChange={handleChange}
          rows="2"
          style={{ width: "100%" }}
        />
      </div>

      {/* アクセス情報入力欄 */}
      <div style={{ marginBottom: "10px" }}>
        <label>アクセス</label><br />
        <textarea
          name="access"
          value={formData.access}
          onChange={handleChange}
          rows="2"
          style={{ width: "100%" }}
        />
      </div>

      {/* 画像アップロード欄（3枚） */}
      <div style={{ marginBottom: "10px" }}>
        <label>外観・内観等（画像3枚）</label>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <input
              type="file"
              accept="image"
              onChange={(e) => handleImageChange(i, e.target.files[0])}
              style={{
              marginBottom: "10px",
              fontSize: "16px",
              padding: "8px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "6px"
        }}
        />

       {/* プレビュー表示：画像が選択されていれば表示する */}
      {formData.images[i] && (
        <img
          src={URL.createObjectURL(formData.images[i])} // 一時的なURLを作って表示
          alt={`画像${i + 1}のプレビュー`}             // alt属性（画像が表示できないときの説明）
          style={{
            width: "100%",              // 横幅いっぱいに表示
            maxHeight: "300px",         // 高さの最大値を設定（縦長すぎないように）
            objectFit: "cover",         // はみ出さないように画像をトリミング
            borderRadius: "8px",        // 角を丸くする
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)" // 影をつけて立体感を出す
          }}
        />
        )}
      </div>
        ))}
    </div>


      {/* 予算 */}
      <div style={{ marginBottom: "10px" }}>
        <label>予算</label><br />
        <input
          name="budget_id"
          value={formData.budget_id}
          onChange={handleChange}
          style={{ width: "100%" }}
        />
      </div>

      {/* ホームページURL入力欄 */}
      <div style={{ marginBottom: "10px" }}>
        <label>ホームページURL</label><br />
        <input
          name="url"
          value={formData.url}
          onChange={handleChange}
          style={{ width: "100%" }}
        />
      </div>

       {/* 住所入力欄 */}
      <div style={{ marginBottom: "10px" }}>
        <label>住所</label><br />
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          style={{ width: "100%" }}
        />
      </div>


      {/* コメント入力欄 */}
      <div style={{ marginBottom: "10px" }}>
        <label>コメント</label><br />
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          rows="2"
          style={{ width: "100%" }}
        />
      </div>

      {/* 登録ボタン */}
      <button
        onClick={handleSubmit} // クリック時に送信処理を実行
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#ddd",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        登録する
      </button>
    </div>
  );
}

// 他のファイルからこのコンポーネントを使えるようにする
export default ShopForm;
