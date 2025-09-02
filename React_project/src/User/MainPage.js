import React, { useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Link } from "react-router-dom";


// イベント情報
const events = [
  { date: "2023-09-10", title: "花火大会", description: "大規模な夏祭りと花火大会", time: "19:00" },
  { date: "2023-09-15", title: "フードフェス", description: "地元グルメが集まるフードフェスティバル", time: "11:00" },
  { date: "2023-09-20", title: "音楽ライブ", description: "人気バンドによる野外ライブ", time: "18:30" },
];

// 曜日
const DOW = ["日", "月", "火", "水", "木", "金", "土"];

// カレンダー生成用フック
function useMonthCells(year, month) {
  const date = new Date(year, month - 1, 1);
  const firstDay = date.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells = [];
  let week = Array(firstDay).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      cells.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    cells.push(week);
  }

  return cells;
}

// フェードイン用ラッパー
function Reveal({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      {children}
    </motion.div>
  );
}

export default function MainPage() {
  const today = new Date();
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  //ハンバーガーボタンメニュー開閉状態  
  const [isOpen, setIsOpen] = useState(false); // メニューの開閉状態

  return (
    <div className="main-container">
      {/* ヘッダー */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold">Loveりべつ</h1>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-600">ホーム</Link>
            <Link to="/events" className="hover:text-blue-600">イベント</Link>
            <Link to="/restaurants" className="hover:text-blue-600">飲食店</Link>
            <Link to="/login" className="hover:text-blue-600">ログイン</Link>
            <Link to="/signup" className="hover:text-blue-600">サインアップ</Link>
          </nav>
        </div>
      </header> 

      {/* ハンバーガーボタン */}
      <nav className="humburger-nav">
        <button className="humburger-btn"
          onClick = {() => setIsOpen(!isOpen)}  //クリックで開閉切り替え
        >≡</button>

        {/* メニュー（isOpen が true のとき表示） */}
        {isOpen && (
          <ul /*style = {style.menu}*/>
            <li>
              <Link to="/">ホーム</Link>
            </li>

            <li>
                <Link to="/login">ログイン</Link>
            </li>

            <li>
              <Link to="/signup">サインアップ</Link>
            </li>

            <li>
              <Link to="/MyPage">マイページ</Link>
            </li>


            <li>
              <Link to="/ReportForm">問い合わせ・通報フォーム</Link>
            </li>

            <li>
              <Link to="/RestaurantDetail">飲食店詳細</Link>
            </li>

            <li>
              <Link to="/EventDetail">イベント詳細</Link>
            </li>
          </ul>
        )}
      </nav>


      {/* メイン */}
      <main className="main-content">
        {/* タイトル */}
        <section className="title-section">
          <motion.h2
            className="title-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            ようこそ登別へ
          </motion.h2>
          <TypeAnimation
            sequence={["温泉", 2000, "自然", 2000, "観光スポット", 2000]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            className="typing-text"
          />
        </section>

        {/* カレンダー */}
        <Reveal>
          <section className="clendar-section">
            <h3 className="clendar-title">イベントカレンダー</h3>
            <div className="clendar-grid">
              {DOW.map((day) => (
                <div key={day} className="clendar-header">{day}</div>
              ))}
              {useMonthCells(today.getFullYear(), today.getMonth() + 1).map((week, i) =>
                week.map((day, j) => {
                  const dateStr = day ? `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : null;
                  const hasEvent = events.some((e) => e.date === dateStr);
                  return (
                    <div
                      key={`${i}-${j}`}
                      className={`calendar-cell ${hasEvent ? "bg-yellow-200" : ""}`}
                      onClick={() => setSelectedDateStr(dateStr)}
                    >
                      {day || ""}
                    </div>
                  );
                })
              )}
            </div>
            {/* イベント詳細 */}
            {selectedDateStr && (
              <div className="event-detail">
                {events.filter((e) => e.date === selectedDateStr).map((e, i) => (
                  <div key={i}>
                    <h4 className="font-bold">{e.title}</h4>
                    <p>{e.description}</p>
                    <p>時間: {e.time}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </Reveal>

        {/* 飲食店リスト */}
        <Reveal>
          <section className="restaurant-section">
            <h3 className="section-title">おすすめ飲食店</h3>
            <div className="section-grid">
              {[
                { name: "登別温泉旅館", rate: "★★★★☆ 4.8", genre: "本格懐石料理", price: "¥¥¥¥" },
                { name: "地元ラーメン店", rate: "★★★★☆ 4.2", genre: "ラーメン", price: "¥¥" },
                { name: "新鮮海鮮市場", rate: "★★★★★ 4.9", genre: "寿司・海鮮", price: "¥¥¥" },
              ].map((shop, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="border rounded-lg p-4 shadow"
                >
                  <h4 className="font-bold text-lg">{shop.name}</h4>
                  <p>{shop.rate}</p>
                  <p>{shop.genre}</p>
                  <p>{shop.price}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </Reveal>
      </main>

      {/* フッター */}
      <footer className="footer">
        <p>&copy; 2023 登別観光情報</p>
      </footer>
    </div>
  );
}
