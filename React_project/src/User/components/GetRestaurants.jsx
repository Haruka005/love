import React, { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import Pagenation from "./Pagenation";

function GetRestaurants(){

    const [restaurants, setRestaurants] = useState([]); // DBから取得した店舗情報
    const [loading, setLoading] = useState(true);       // 読み込み状態
    const [error, setError] = useState(null);           // エラー状態
    const [selectedGenre, setSelectedGenre] = useState("すべて"); // 現在選択中のジャンル

    const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 4;
    
      // ページネーション処理
      const indexOfLastRestaurant = currentPage * itemsPerPage;
      const indexOfFirstRestaurant = indexOfLastRestaurant - itemsPerPage;
      const currentRestaurant = restaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);
      const totalPages = Math.ceil(restaurants.length / itemsPerPage);

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
            <div className="button-group">
                {["すべて", "和食", "洋食", "中華・アジア", "スイーツ・デザート", "ファストフード・軽食", "その他"].map((genre) => (
                    <button
                        key={genre}
                        className={`tab-button ${selectedGenre === genre ? "active" : ""}`}
                        onClick={() => setSelectedGenre(genre)}
                    >
                        {genre}
                    </button>
                ))}
            </div>


            {/* 店舗カード一覧 */}
             <div className="card-list">
                {filtered.length === 0 && !loading ? (
                <p>該当する店舗はありません。</p>
                ) : (
                filtered.map((shop) => (
                    <RestaurantCard
                        key={shop.id}
                        id={shop.id}
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

            {/* ---------- データの状態ごとに出し分け ---------- */}
            {loading && <p>読み込み中です…</p>}
            {error && <p>エラー: {error}</p>}


            <Pagenation
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </section>
    );
}

export default GetRestaurants;