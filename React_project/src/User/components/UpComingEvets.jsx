import React, { useEffect, useState } from "react";

{/* 直近のイベント */}

function UpComingEvents(){
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    // useEffect = 最初に表示されたとき一度だけデータ取りに行く
    useEffect(() => {
        const fetchUpcomingEvents = async () => { // async･･･awaitから結果帰ってくるまで次の処理しないで待つ
            try {
                // バックエンドにリクエスト送る
                const response = await fetch("http://127.0.0.1:8000/api/events/upcoming");
               
                // 帰ってきたイベント一覧（JSON形式）をJavaScript形式に変換してdataに入れる
                const data = await response.json();

                console.log("受け取ったデータ:", data); // ← ここに追加！

                // 上で宣言したeventsにsetする
                setEvents(data);
                console.log("イベント取得成功:", data);
            } catch(error) {
                console.error("イベント取得エラー:", error);
                setError("イベントを取得できませんでした");
            }
        };
        fetchUpcomingEvents();
    }, []);

    return (
    <section className="container">
      <h2>直近のイベント</h2>
      {events.length === 0 ? (
        <p>現在予定されているイベントはありません。</p>
      ) : (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
          {events.map((event, i) => (
            <div key={i} className="card">
              <h3>{event.name}</h3>
              <h4>{event.catchphrase}</h4>
              <p>
                開始日: {event.start_date}<br />
                終了日: {event.end_date}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
export default UpComingEvents;

