import { useNavigate } from "react-router-dom";
import BaseCard from "./BaseCard";

export default function EventCard({
  id,
  name,
  catchphrase,
  image,
  start_date,
  end_date,
  place,
}) {
  const navigate = useNavigate();

  return (
    <BaseCard>
      <div
        onClick={() => navigate(`/events/${id}`)}
        style={{cursor:"pointer"}}
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
        <p>□ {start_date} ～ {end_date}</p>
        <p>📍 会場：{place}</p>
      </div>
    </BaseCard>
  );
}
