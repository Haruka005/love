import React, { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";

function GetRestaurants(){

    const [restaurants, setRestaurants] = useState([]); // DBから取得した店舗情報
    const [loading, setLoading] = useState(true);       // 読み込み状態
    const [error, setError] = useState(null);           // エラー状態
    const [selectedGenre, setSelectedGenre] = useState("すべて"); // 現在選択中のジャンル


    // APIからデータを取得
    useEffect(() => {
       fetch("http://localhost:8000/api/restaurants")
        .then((response) => {
            if (!response.ok) throw new Error("通信エラー");
            return response.json();
        })
       .then((data) => {
            setRestaurants(data);
            setLoading(false);
       })
       //途中でエラー起きる
      .catch((err) => {
            setError(err.message);
            setLoading(false);
      });
    },[]);


    //ジャンルでフィルタリング
    const filtered = selectedGenre === "すべて"
    ? restaurants
    : restaurants.filter((shop) => shop.genre.name === selectedGenre);


    //.filter→配列の中から条件に合うものだけ取り出す関数
    //shopは任意の名前　配列内の1件ずつを指す



    // 表示
    return (
        <section style={{ marginBottom: "30px", textAlign: "center" }}>
            <h2>飲食店一覧</h2>

             {/* ジャンル切替ボタン群 */}
            <div style={{ marginBottom: "30px", display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                {["すべて", "和食", "洋食", "中華・アジア", "スイーツ・デザート", "ファストフード・軽食", "その他"].map((genre) => (
                    <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            {/* ---------- データの状態ごとに出し分け ---------- */}
            {loading && <p>読み込み中です…</p>}
            {error && <p style={{ color: "red" }}>エラー: {error}</p>}


            {/* 店舗カード一覧 */}
             <div className="flex flex-wrap justify-center gap-6">
                {filtered.length === 0 && !loading ? (
                <p>該当する店舗はありません。</p>
                ) : (
                filtered.map((shop) => (
                    <RestaurantCard
                        key={shop.id}
                        name={shop.name}
                        area={shop.area.name}
                        genre={shop.genre.name}
                        budget={shop.budget.name}
                        address={shop.address}
                        image={shop.image_url}
                    />
                ))
                )}
            </div>
        </section>
    );
}

export default GetRestaurants;