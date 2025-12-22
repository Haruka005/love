import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { DateTime } from "./dateForatter";

{/* 直近のイベント */}

function UpComingEvents(){
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    // useEffect = 最初に表示されたとき一度だけデータ取りに行く
    useEffect(() => {
        const fetchUpcomingEvents = async () => { // async･･･awaitから結果帰ってくるまで次の処理しないで待つ
            try {
               
                // バックエンドにリクエスト送る
                //const response = await fetch(`${process.env.REACT_APP_API_URL}/events/upcoming`);
               
                //ローカルではこれだよ
                const response = await fetch(`${process.env.REACT_APP_API_URL}/events/upcoming`);

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

    if (error) {
     return <p style={{ color: "red", padding: "20px" }}>エラー: {error}</p>;
    }

    return(
    <section className="container">
      <h2>直近のイベント</h2>
      {events.length === 0 ? (
        <p>現在予定されているイベントはありません。</p>
      ) : (
        <div className="card-list">
          {events.map((event) => (
            <EventCard
              key={event.id}
                id={event.id}
                name={event.name}
                catchphrase={event.catchphrase}
                //image={event.image_path}    
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

