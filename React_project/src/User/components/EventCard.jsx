import React from "react";
import BaseCard from "./BaseCard";

export default function EventCard({
  name,
  catchphrase,
  image,
  start_date,
  end_date,
  place,
}) {
  return (
    <BaseCard image={image}>
      <h3 className="text-xl font-bold text-pink-700 mb-2">{name}</h3>
      <p className="text-gray-600 italic mb-2">{catchphrase}</p>
      <p className="text-gray-600">
        🗓 {start_date} ～ {end_date}
      </p>
      <p className="text-gray-700 text-sm mt-2">📍 会場：{place}</p>
    </BaseCard>
  );
}
