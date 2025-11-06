import React from "react";
import BaseCard from "./BaseCard";

export default function RestaurantCard({
  name,
  area,
  genre,
  budget,
  address,
  image,
}) {
  return (
    <BaseCard image={image}>
      <h3 className="text-xl font-bold text-pink-700 mb-2">{name}</h3>

      <div className="text-gray-600 space-y-1">
        <p>📍 エリア：{area}</p>
        <p>🍴 ジャンル：{genre}</p>
        <p>💰 予算：{budget}</p>
      </div>

      <p className="text-gray-700 text-sm mt-3"> 🏠 場所：{address}</p>
    </BaseCard>
  );
}
