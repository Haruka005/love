import React, { useEffect, useState } from "react";
 
// イベント一覧 
function GetEvents(){
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); //月は0始まりなので+1
  const [monthlyEvents, setMonthlyEvents] = useState([]); //[ここは取得したイベントいれる,ここは左の中身変えたいときに使う関数]空の配列に入れる
  const [error, setError] = useState(null);

  //カードデザイン設定
  const cardStyle = {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  };

  //ページを開いたときにAPI呼ぶ(useEffect)
  useEffect(() => {
    const fetchEvents = async () => { //async･･･awaitから結果帰ってくるまで次の処理しないで待つ
      try {

        //文字列の可能性があるselectedMonthを数値に変換
        const monthNumber = parseInt(selectedMonth, 10);

        const res = await fetch(
          `http://localhost:8000/api/events/${selectedYear}/${selectedMonth}`
        ); // await･･･結果取得できるまで次の処理しないで待つ

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();  // JSONをJavaScriptの配列に変換
        setMonthlyEvents(data);  // stateに保存
        setError(null);   // 成功したらエラーリセット

        console.log(`イベント取得成功: ${data.length}件`, data);

      } catch (error) {
        console.error("イベント取得失敗", error);
        setMonthlyEvents([]); // 失敗したら空配列
        setError("イベント取得に失敗しました"); // エラー表示用
      }
    };

    fetchEvents();//画面が表示されたときに実行されたいのでここで実行処理書く
  }, [selectedYear, selectedMonth]); // 年月が変わるたびに呼び出す

  return(
      <section style={{ marginBottom: "30px", textAlign: "center" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>月別イベント</h3>

        {/* 年の選択セレクトボックス */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            年を選択：
            {/* selectedYear を使って年を切り替える（onChange で state を更新） */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{ marginLeft: "8px" }}
            >
              {/* 必要な年をここに追加する（動的に生成する方法もあります） */}
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </label>
        </div>

        {/* 月選択ボタン群（1月〜12月） */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
          {/* [...Array(12)] を使って 12 個のボタンを作る（i は 0〜11）*/}
          {[...Array(12)].map((_, i) => {
            // 月を "01" から "12" のゼロ埋め文字列にする
            const month = String(i + 1).padStart(2, "0");
            return (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)} // 押したら selectedMonth を更新
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: selectedMonth === month ? "2px solid #000" : "1px solid #ccc",
                  backgroundColor: selectedMonth === month ? "#eee" : "#fff",
                  fontWeight: selectedMonth === month ? "bold" : "normal",
                  cursor: "pointer"
                }}
              >
                {/* 表示は 1月なら "1月" のように数値にしている */}
                {parseInt(month)}月
              </button>
            );
          })}
        </div>

        {/* 選択中の年・月の見出し */}
        <div>
          <h4 style={{ fontSize: "18px", marginBottom: "10px" }}>
            {selectedYear}年 {parseInt(selectedMonth)}月 のイベント
          </h4>

          {/* イベントが無ければメッセージ、あればカードで表示 */}
          {monthlyEvents.length === 0 ? (
            // データが空のときの案内
            <p>この月のイベント情報はまだありません。</p>
          ) : (
            // イベントがあるときにカードで表示
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
              {monthlyEvents.map((event, i) => (
                <div key={i} style={cardStyle}>
                  {/*　イベント名 */}
                  <h3 style={{ fontWeight: "bold", fontSize: "20px" }}>{event.name}</h3>
                  {/*　見出し */}
                  <h4 style={{ fontWeight: "bold", fontSize: "18px" }}>{event.catchphrase}</h4>
                  {/*　開催日・終了日 */}
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