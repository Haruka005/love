import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
// 正しいスペル (dateFormatter) に修正
import { DateTime } from "./dateFormatter.js";

/**
 * 直近のイベントを表示するコンポーネント
 */
function UpComingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect: コンポーネントがマウントされた時に一度だけデータを取得
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        // .env からベースURLを取得
        const baseUrl = process.env.REACT_APP_API_URL;
        
        // バックエンドにリクエストを送る（Laravel等の標準に合わせて /api を付与）
        const response = await fetch(`${baseUrl}/events/upcoming`);

        // レスポンスが正常でない場合はエラーを投げる
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // JSON形式をJavaScriptオブジェクトに変換
        const data = await response.json();
        console.log("注目のイベント取得成功:", data);

        // 取得したデータをステートに保存
        setEvents(data);
      } catch (error) {
        console.error("イベント取得エラー:", error);
        setError("注目のイベントを取得できませんでした");
      } finally {
        setLoading(false);
      }
    };

    // 環境変数が設定されている場合のみ実行
    if (process.env.REACT_APP_API_URL) {
      fetchUpcomingEvents();
    } else {
      console.error("環境変数 REACT_APP_API_URL が設定されていません。");
      setLoading(false);
    }
  }, []);

  // 読み込み中表示
  if (loading) {
    return <p style={{ textAlign: "center", padding: "20px" }}>イベントを読み込み中...</p>;
  }

  // エラー発生時の表示
  if (error) {
    return <p style={{ color: "red", textAlign: "center", padding: "20px" }}>エラー: {error}</p>;
  }

  return (
    <section className="container" style={{ padding: "40px 0" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>直近のイベント</h2>
      
      {events.length === 0 ? (
        <p style={{ textAlign: "center" }}>現在予定されているイベントはありません。</p>
      ) : (
        <div className="card-list" style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
          gap: "20px",
          padding: "0 20px"
        }}>
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              name={event.name}
              catchphrase={event.catchphrase}
              // 画像パスはバックエンドのキー（topimage_pathなど）に合わせて調整してください
              image={event.topimage_path || event.image_url}
              // dateFormatter.jsx の DateTime 関数を使用
              start_date={DateTime(event.start_date)}
              end_date={DateTime(event.end_date)}
              location={event.location}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default UpComingEvents;