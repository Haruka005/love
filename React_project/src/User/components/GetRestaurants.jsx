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
       fetch("http://127.0.0.1:8000/api/restaurants")
        .then((response) => {
        if (!response.ok) {
            // ステータスコードが4xx/5xxの場合、レスポンスの本文をエラーとして取得を試みる
            return response.text().then(text => {
                throw new Error(`HTTP error! status: ${response.status}. Detail: ${text.substring(0, 200)}...`);
            });
        }
        
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

    //ジャンルでフィルタリング（単一ジャンル対応）
    const filtered = selectedGenre === "すべて"
        ? restaurants
        : restaurants.filter((shop) =>
         shop.genre?.name === selectedGenre
    );


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
                name={shop.name ?? "名称未設定"}
                area={shop.area?.name ?? "エリア不明"}
                genre={shop.genre?.name ?? "ジャンル不明"}
                budget={shop.budget?.name ?? "予算不明"}
                address={shop.address ?? "住所不明"}
                // image_url ではなく topimage_path （DBのカラム名）になっているか確認
                image={shop.topimage_path ?? ""} 
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