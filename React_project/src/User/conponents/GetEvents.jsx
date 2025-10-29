import React, { useState, useEffect } from "react";

function GetEvents() {
  const now = new Date();   //現在時刻取得しnowに保存
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());  //初期値現在の年
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); //初期値現在の月

  const [events, setEvents] = useState([]); //取得したイベントを格納する配列。初期値は空
  const [loading, setLoading] = useState(false); // データ取得中か管理する。初期はfalse
  const [error, setError] = useState(null);   //エラー状態を管理。初期値はnull

  //イベントカードの表示スタイル
  const cardStyle = {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  };

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
    <section style={{ marginBottom: "30px", textAlign: "center" }}>
      <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>月別イベント</h3>

      {/* 年選択 */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          年を選択：
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            style={{ marginLeft: "8px" }}
          >
            {[2024, 2025, 2026].map((year) => (
              <option key={year} value={year}>{year}</option>
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
              onClick={() => setSelectedMonth(month)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: selectedMonth === month ? "2px solid #000" : "1px solid #ccc",
                backgroundColor: selectedMonth === month ? "#eee" : "#fff",
                fontWeight: selectedMonth === month ? "bold" : "normal",
                cursor: "pointer"
              }}
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
              <div key={event.id} style={cardStyle}>
                <h3 style={{ fontWeight: "bold", fontSize: "20px" }}>{event.name}</h3>
                <h4 style={{ fontWeight: "bold", fontSize: "18px" }}>{event.catchphrase}</h4>
                <p>
                  開始日: {event.start_date} <br />
                  終了日: {event.end_date}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default GetEvents;
