//イベント詳細画面
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function RestaurantDetail() {
  const {id} = useParams(); //ULRからIDを取得
  const [event,setEvent] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(() =>{
    const fetchEvent =async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/events/${id}`);
        if (!res.ok) throw new Error("イベント取得失敗");
        const data = await res.json();
         console.log("取得したイベント:", data);
        setEvent(data);
      }catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if(loading) return <p>読み込み中･･･</p>;
  if(!event) return <p>イベントが見つかりません</p>;
    
  return (
    <div>
      <h1>{event.name}</h1>

      {event.image_url && (
        <img
          src={event.image_url}
          alt={event.name}
          style={{ width: "100%", maxWidth: "500px", borderRadius: "8px" }}
        />
      )}

      <div>
        <h3>{event.catchphrase}</h3>
      </div>

      <div>
        <h3>イベント内容</h3>
        <ul>
          <li>開催期間:{event.start_date} ~ {event.end_date}</li>
          <li>場所:{event.place}</li>
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
          <p>{event.description}</p>
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