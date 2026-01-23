import { useNavigate } from "react-router-dom";
import BaseCard from "./BaseCard";


// 飲食店カードコンポーネント
export default function RestaurantCard({
  id,
  name,
  area,
  genre,
  budget,
  address,
  image,
}) {
  const navigate = useNavigate();

  return (
    <BaseCard>
      <div
        onClick={() => navigate(`/restaurants/${id}`)}
        style={{ cursor: "pointer" }}
      >
        {image && (
          <img
            src={image}
            alt={name}
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              borderRadius: "8px 8px 0 0",
              marginBottom: "10px",
            }}
          />
        )}
        <h3>{name}</h3>
        <p>ジャンル：{genre}</p>
        <p>住所：{address}</p>
      </div>
    </BaseCard>
  );
}
