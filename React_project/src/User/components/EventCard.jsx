import BaseCard from "./BaseCard";
import { useNavigate } from "react-router-dom";

// イベントカードコンポーネント

export default function EventCard({
  id,
  name,
  catchphrase,
  image,
  start_date,
  end_date,
  location,
}) {
  const navigate = useNavigate();

  return (
    <BaseCard>
      <div
        onClick={() => navigate(`/events/${id}`)}
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
        <p>{catchphrase}</p>
        <p>
          📅 {start_date} ～ {end_date}
        </p>
        <p>📍 会場：{location}</p>
      </div>
    </BaseCard>
  );
}
