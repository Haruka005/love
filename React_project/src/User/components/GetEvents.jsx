import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";


function GetEvents() {
  const now = new Date();   //現在時刻取得しnowに保存
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());  //初期値現在の年
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); //初期値現在の月

  const [events, setEvents] = useState([]); //取得したイベントを格納する配列。初期値は空
  const [loading, setLoading] = useState(false); // データ取得中か管理する。初期はfalse
  const [error, setError] = useState(null);   //エラー状態を管理。初期値はnull

  const yearOptions = [
  { value: 2025, label: "2025" },
  { value: 2026, label: "2026" },
  ];



  useEffect(() => {
    //API取得処理
    const fetchEvents = async () => {
      setLoading(true); // API取得開始。読み込みフラグをtrueに
      try {
        //選択した月をURLに渡せるように文字列に変換する
        const monthStr = String(selectedMonth).padStart(2, "0");

        //サーバーからイベント取得
        const res = await fetch(`http://localhost:8000/api/events/${selectedYear}/${monthStr}`);

        //取得失敗したら例外を投げる
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        //JavaScriptの形式に変換
        const data = await res.json();

        setEvents(data);//取得したデータをセット
        setError(null);//成功したのでエラーをnullに

      } catch (err) {
        console.error(err);
        setError("イベント取得に失敗しました");
        setEvents([]);//イベント配列を空に
      } finally {
        //成功失敗に関わらず、データ取得後loadingをfalseに戻す
        setLoading(false); // API取得終了
      }
    };

    //定義したfetchEventsを実際に呼び出しデータ取得
    fetchEvents();
    
    //selectedYearまたはselectedMonthが変わるたびに再実行
  }, [selectedYear, selectedMonth]);

  return (
    <section 
      style={{ 
        marginTop: "0px",  
        padding: "10px 0", 
        marginBottom: "30px", 
        textAlign: "center", 
        backgroundImage: `url("/images/akaoni_background.png")`,
        backgroundSize: "cover",         // ← 画像をセクション全体にフィット
        backgroundPosition: "center",    // ← 画像の中心を表示
        backgroundRepeat: "no-repeat",   // ← 繰り返さない
        color: "#333",   
      }}
    >
      <h2>月別イベント</h2>

      {/* 年選択 */}
      <div style={{ marginBottom: "10px" }}>
        <label className="selectbox" >
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {yearOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label> 
      </div>

      {/* 月選択ボタン */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
        {[...Array(12)].map((_, i) => {
          const month = i + 1;
          return (
           <button
              key={month}
              className={`tab-button ${selectedMonth === month ? "active" : ""}`}
              onClick={() => setSelectedMonth(month)}
            >
              {month}月
            </button>
          );
        })}
      </div>

      {/* 読み込み中メッセージ */}
      {loading && <p>読み込み中...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 選択中年月 */}
      <div>
        <h4 style={{ fontSize: "18px", marginBottom: "10px" }}>
          {selectedYear}年 {selectedMonth}月 のイベント
        </h4>

        {/* イベントカード表示 */}
        {events.length === 0 && !loading ? (
          <p>イベント情報はありません</p>
        ) : (
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
            {events.map((event) => (
              <EventCard
                key={event.id}
                name={event.name}
                catchphrase={event.catchphrase}
                image={event.image_url}     // ← 画像のURLフィールドがある場合
                start_date={event.start_date}
                end_date={event.end_date}
                place={event.place}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default GetEvents;
