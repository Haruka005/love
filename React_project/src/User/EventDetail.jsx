//イベント詳細画面
import React from "react";

export default function RestaurantDetail() {
  return (
    <div>
      <h2>イベント名（タイトル）</h2>

      <div>
        <p>[画像エリア]</p>
      </div>

      <div>
        <h3>見出し</h3>
        <p>（例）レポ付き体験レポーターでは、実地に訪れてレポ</p>
      </div>

      <div>
        <h3>イベント内容</h3>
        <ul>
          <li>開催日</li>
          <li>場所</li>
          <li>時間</li>
          <li>参加費</li>
          <li>持ち物</li>
          <li>予約</li>
          <li>ホームページURL</li>
          <li>主催者</li>
        </ul>
      </div>

      <div>
        <h3>詳細</h3>
        <div>
          <ul>
            <li>・小さなお子様は保護者同伴でご参加ください。</li>
            <li>・天候不良の場合は連絡いたします。</li>
            <li>・天候によっては中止となる場合があります。</li>
          </ul>
        </div>
      </div>

      <div>
        <h3>注意事項</h3>
        <div>
          <ul>
            <li>・小さなお子様は保護者同伴でご参加ください。</li>
            <li>・天候不良の場合は連絡いたします。</li>
            <li>・天候によっては中止となる場合があります。</li>
          </ul>
        </div>
      </div>

      <div>
        <button>ボタン</button>
      </div>
    </div>
  );
}