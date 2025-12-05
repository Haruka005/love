// 飲食店詳細画面
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function RestaurantDetail() {
  const { id } = useParams(); // URLからid取得
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/restaurants/${id}`);
        if (!res.ok) throw new Error("飲食店取得失敗");
        const data = await res.json();
        setRestaurant(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <p>読み込み中...</p>;
  if (!restaurant) return <p>飲食店が見つかりません。</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>{restaurant.name}</h2>

      {restaurant.image_url && (
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          style={{ width: "100%", maxWidth: "500px", borderRadius: "8px" }}
        />
      )}

      <p style={{ fontSize: "18px", marginTop: "10px" }}>{restaurant.catchphrase}</p>

      <div style={{ marginTop: "20px" }}>
        <h3>店舗情報</h3>
        <p>ジャンル：{Array.isArray(restaurant.genre_names) ? restaurant.genre_names.join("・") : "ジャンル不明"}</p>
        <p>エリア：{restaurant.area?.name ?? "エリア不明"}</p>
        <p>予算：{restaurant.budget?.name ?? "予算不明"}</p>
        <p>住所：{restaurant.address ?? "住所不明"}</p>
        <p>営業時間：{restaurant.business_hours ?? "未設定"}</p>
        <p>定休日：{restaurant.holiday ?? "未設定"}</p>
      </div>

      {/* コメント欄を追加 */}
      <div style={{ marginTop: "20px" }}>
        <h3>コメント</h3>
        <p>{restaurant.comment ?? "コメントはありません"}</p>
      </div>

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button onClick={() => window.history.back()}>
          戻る
        </button>
      </div>
    </div>
  );
}