import React from "react";

export default function RestaurantDetail() {
  return (
    <div>
      <h2>店名（タイトル）</h2>

      {/* メイン画像 */}
      <div>[画像アップロード]</div>

      {/* 見出し */}
      <h4>見出し</h4>
      <p>（例）朝採れ野菜を使ったおすすめメニュー</p>

      {/* アクセス */}
      <h3>アクセス</h3>
      <div>[地図またはGoogleマップ埋め込み]</div>

      {/* 外観・内観画像 */}
      <h3>外観・内観等</h3>
      <div>[画像アップロード]（外観）</div>
      <div>[画像アップロード]（内観）</div>
      <div>[画像アップロード]（スタッフ）</div>

      <p>（例）店主とお店を紹介した画像もあります！</p>

      {/* 詳細 */}
      <h3>詳細</h3>
      <p>ホームページURL</p>
      <p>予約</p>
      <p>住所</p>

      {/* コメント */}
      <h3>コメント</h3>
      <textarea rows="5" cols="30" placeholder="コメントを入力"></textarea>

      {/* ボタンなど */}
      <div>
        <button>投稿</button>
        <button>★</button>
        <button>✎</button>
      </div>
    </div>
  );
}
