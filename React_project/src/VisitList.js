import React,{useState} from "react";

export default function VisitList() {
    const [serchTem,setSearchTerm]=useStatus("");
    const stores =[
        {name:"登別温泉旅館"},genre:"懐石料理"},
        {name:"地元ラーメン店",genre:"ラーメン"},
        {name:"海鮮市場",genre:"寿司・海鮮"},
    ];

    const filteredStores = stores.filter((store) =>
    store.name.includes(searchTerm) || store.genre.includes(searchTerm)
  );

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>来店店舗一覧</h2>

      {/* 検索バー */}
      <input
        type="text"
        placeholder="店名やジャンルで検索"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "8px",
          width: "100%",
          marginBottom: "20px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

 {/* 店舗カード一覧 */}
      {filteredStores.map((store, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <p><strong>店名:</strong> {store.name}</p>
          <p><strong>ジャンル:</strong> {store.genre}</p>
        </div>
      ))}

      {/* ページ送り（ダミー） */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <button style={{ padding: "8px", borderRadius: "4px", backgroundColor: "#eee", border: "none" }}>
          前のページ
        </button>
        <button style={{ padding: "8px", borderRadius: "4px", backgroundColor: "#eee", border: "none" }}>
          次のページ
        </button>
      </div>
    </div>
  );
}

}