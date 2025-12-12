// イベント詳細画面
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function EventDetail() {
  const { id } = useParams(); // URLからid取得
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error("イベント取得失敗");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p>読み込み中...</p>;
  if (!event) return <p>イベントが見つかりません。</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>{event.name}</h2>


  {event.image_path && ( 
          <img
            src={event.image_path} 
            alt={event.name}
            style={{ width: "100%", maxWidth: "500px", borderRadius: "8px" }}
          />
        )}

      <p>{event.catchphrase}</p>

      <div style={{ marginTop: "20px" }}>
        <h3>イベント情報</h3>
        <p>開始日：{event.start_date}</p>
        <p>終了日：{event.end_date}</p>
        <p>場所：{event.location ?? "未設定"}</p>
        <p>URL：{event.url ?? "未設定"}</p>
        <p>主催者：{event.organizer ?? "未設定"}</p>
        <p>予約：
          {event.is_free_participation === 0
            ? "要予約"
            : event.is_free_participation === 1
            ? "自由参加"
            : "未設定"}
        </p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>詳細</h3>
        <p>{event.description ?? "詳細はありません"}</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>注意事項</h3>
        <p>{event.notes ?? "注意事項はありません"}</p>
      </div>

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button onClick={() => window.history.back()}>
          戻る
        </button>
      </div>
    </div>
  );
}

