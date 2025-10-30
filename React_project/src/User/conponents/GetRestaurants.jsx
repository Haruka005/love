import React, { useEffect, useState } from "react";

function GetRestaurants(){

    const [restaurants, setRestaurants] = useState([]); // DBから取得した店舗情報
    const [loading, setLoading] = useState(true);       // 読み込み状態
    const [error, setError] = useState(null);           // エラー状態

    // APIからデータを取得
    useEffect(() => {
        const fetchRestaurants = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/restaurants"); // LaravelのAPI URL
            if (!response.ok) throw new Error("データ取得に失敗しました");
            const data = await response.json();
            setRestaurants(data);  // 取得データをstateにセット
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); // 読み込み完了
        }
        };
        fetchRestaurants();
    },[]);

    //読み込み中
    if (loading) return <p>読み込み中...</p>;

    //エラー時
    if (error) return <p style={{ color: "red" }}>エラー: {error}</p>;

    // データがない場合
    if (restaurants.length === 0) return <p>飲食店情報はありません</p>;

    // 表示
    return (
        <section style={{ marginBottom: "30px", textAlign: "center" }}>
        <h3>飲食店一覧</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
            {restaurants.map((shop) => (
            <div key={shop.id} style={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                width: "250px",
                textAlign: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}>
                <div style={{
                width: "100%",
                height: "150px",
                backgroundColor: "#ddd",
                borderRadius: "6px",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
                }}>
                {/* 画像URLがあれば <img src={shop.image} /> に置き換え */}
                <span style={{ color: "#888" }}>画像挿入予定</span>
                </div>
                <h4>{shop.name}</h4>
                <p>{shop.genre}</p>
            </div>
            ))}
        </div>
        </section>
    );
}

