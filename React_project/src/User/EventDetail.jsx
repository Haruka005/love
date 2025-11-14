//イベント詳細画面
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function RestaurantDetail() {
  const { id } = useParams(); // URLからid取得
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/events/${id}`);
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

      {event.image_url && (
        <img
          src={event.image_url}
          alt={event.name}
          style={{ width: "100%", maxWidth: "500px", borderRadius: "8px" }}
        />
      )}

      <p>{event.catchphrase}</p>

      <div>
        <h3>イベント内容</h3>
        <p>開催期間：{event.start_date}~{event.end_date}</p>
        <p>会場：</p>
        <p>{event.description}</p>
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
            <li>小さなお子様は保護者同伴でご参加ください。</li>
            <li>天候不良の場合は連絡いたします。</li>
            <li>天候によっては中止となる場合があります。</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button
          onClick={() => window.history.back()}
        >
          戻る
        </button>
      </div>
    </div>
  );
}