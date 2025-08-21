// src/App.js
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

/* ---- ダミーイベント ---- */
const events = {
  "2024-04-15": [
    { name: "登別温泉まつり", time: "14:00-18:00", location: "温泉街中央広場", icon: "🎭" },
    { name: "夜桜ライトアップ", time: "18:30-21:00", location: "地獄谷周辺", icon: "🌸" }
  ],
  "2024-04-20": [{ name: "温泉グルメフェス", time: "11:00-16:00", location: "登別駅前", icon: "🍜" }],
  "2024-04-25": [{ name: "鬼火の路", time: "19:00-21:30", location: "地獄谷遊歩道", icon: "👹" }],
  "2024-04-28": [{ name: "春の音楽祭", time: "15:00-20:00", location: "温泉公園", icon: "🎵" }]
};
const DOW = ["日", "月", "火", "水", "木", "金", "土"];

/* ---- 42マス月カレンダー ---- */
function useMonthCells(base = new Date()) {
  return React.useMemo(() => {
    const first = new Date(base.getFullYear(), base.getMonth(), 1);
    const start = new Date(first);
    start.setDate(start.getDate() - first.getDay()); // 日曜始まり
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [base]);
}

/* ---- ふわっと出現ラッパー ---- */
function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const today = new Date();
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const cells = useMonthCells(today);
  const selectedEvents = selectedDateStr ? events[selectedDateStr] : null;

  // ゆる鬼（public/ → 無ければ /images/）
  const oniPrimary = process.env.PUBLIC_URL + "/yuru-oni.png";
  const oniFallback = process.env.PUBLIC_URL + "/images/yuru-oni.png";

  return (
    <div>
      {/* ========= Header ========= */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-[60]">
        <div className="container mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">♨️</div>
              <h1 className="text-3xl font-extrabold text-pink-600">LOVEりべつ</h1>
              <motion.span
                className="text-2xl"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                💕
              </motion.span>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              {["ホーム", "イベント", "飲食店", "ログイン"].map((l) => (
                <button key={l} className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                  {l}
                </button>
              ))}
              <button className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors">
                新規登録
              </button>
            </nav>

            <button
              className="md:hidden text-pink-600"
              onClick={() => document.getElementById("mobileMenu")?.classList.toggle("hidden")}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ========= Mobile Menu ========= */}
      <div id="mobileMenu" className="hidden md:hidden bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto max-w-5xl px-4 py-2 space-y-2">
          {["ホーム", "イベント", "飲食店", "ログイン"].map((label) => (
            <button
              key={label}
              className="block w-full text-left py-2 text-gray-700 hover:text-pink-600"
              onClick={() => document.getElementById("mobileMenu")?.classList.add("hidden")}
            >
              {label}
            </button>
          ))}
          <button
            className="block w-full text-left py-2 text-pink-500 font-medium"
            onClick={() => document.getElementById("mobileMenu")?.classList.add("hidden")}
          >
            新規登録
          </button>
        </div>
      </div>

      {/* ========= Main ========= */}
      <main className="container mx-auto max-w-5xl px-4 py-10">

        {/* ===== KAWAII HERO（POP版） ===== */}
        <section className="mb-12">
          <div
            className="
              relative rounded-[28px] overflow-hidden shadow-[0_30px_70px_rgba(255,105,180,.25)]
              bg-gradient-to-br from-pink-200 via-pink-100 to-purple-100
            "
          >
            {/* デコ・ふわふわ丸（背景ブロブ） */}
            <span className="absolute -left-10 -top-8 w-56 h-56 rounded-full bg-white/40 blur-2xl" />
            <span className="absolute right-6 top-10 w-28 h-28 rounded-full bg-white/50 blur-xl" />
            <span className="absolute left-1/2 bottom-6 -translate-x-1/2 w-64 h-16 rounded-full bg-white/40 blur-xl" />

            {/* リボン帯 */}
            <div className="mx-4 mt-4 rounded-2xl bg-white/70 backdrop-blur-md shadow-lg">
              <div className="px-6 py-6 md:py-8 md:px-10 grid md:grid-cols-2 gap-6 items-center">
                {/* 左：コピー */}
                <div className="text-center md:text-left">
                  <h2 className="text-3xl md:text-[46px] leading-tight font-extrabold text-pink-600 drop-shadow-sm">
                    登別へようこそ
                  </h2>

                  <div className="mt-2 text-gray-700 text-sm md:text-base">
                    <TypeAnimation
                      sequence={[
                        "心も体も温まる、特別な時間をお過ごしください", 1800,
                        "イベント・グルメ・観光を一つに。", 1600,
                        "今日の“たのしい”が、きっと見つかる！", 1600
                      ]}
                      speed={50}
                      deletionSpeed={70}
                      repeat={Infinity}
                      cursor
                    />
                  </div>

                  {/* ほそい下線（POPカラー） */}
                  <div className="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 mx-auto md:mx-0" />
                </div>

                {/* 右：ゆる鬼（大きく・ポン） */}
                <div className="relative">
                  <motion.img
                    src={oniPrimary}
                    onError={(e) => { e.currentTarget.src = oniFallback; }}
                    alt="ゆる鬼"
                    className="mx-auto h-44 md:h-60 drop-shadow-[0_15px_30px_rgba(0,0,0,.15)] select-none"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: [10, -6, 10], opacity: 1 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </div>

            {/* ふんわり下余白 */}
            <div className="h-6" />
          </div>

          {/* 下に小さくスクロールサイン */}
          <div className="text-center text-xs text-gray-500 mt-2 tracking-widest">
            SCROLL <span className="inline-block animate-pulse">↓</span>
          </div>
        </section>

        {/* ===== 今日のイベント（POP配色） ===== */}
        <Reveal>
          <section className="motion-card p-6 shadow-xl mb-8">
            <h3 className="text-2xl font-extrabold text-pink-600 mb-4 flex items-center">
              <span className="mr-2">🎉</span>今日のイベント
            </h3>

            <div className="space-y-3">
              <Reveal>
                <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-4 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">登別温泉まつり</h4>
                      <p className="text-sm text-gray-600">14:00 - 18:00 | 温泉街中央広場</p>
                      <p className="text-xs text-gray-500 mt-1">年に一度の大きなお祭り！鬼踊りや屋台も</p>
                    </div>
                    <span className="text-2xl">🎭</span>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="bg-gradient-to-r from-sky-100 to-cyan-100 p-4 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">夜桜ライトアップ</h4>
                      <p className="text-sm text-gray-600">18:30 - 21:00 | 地獄谷周辺</p>
                      <p className="text-xs text-gray-500 mt-1">幻想的な桜のライトアップ</p>
                    </div>
                    <span className="text-2xl">🌸</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        </Reveal>

        {/* ===== 今月のカレンダー ===== */}
        <Reveal>
          <section className="motion-card p-6 shadow-xl mb-8">
            <h3 className="text-2xl font-extrabold text-pink-600 mb-4 flex items-center">
              <span className="mr-2">📅</span>今月のイベントカレンダー
            </h3>

            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {DOW.map((d) => (
                <div key={d} className="text-sm font-semibold text-gray-600 py-2">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {cells.map((date, i) => {
                const isThisMonth = date.getMonth() === today.getMonth();
                const isToday = date.toDateString() === today.toDateString();
                const dateStr = date.toISOString().split("T")[0];
                const hasEvents = !!events[dateStr];

                return (
                  <motion.button
                    key={i}
                    onClick={() => setSelectedDateStr(dateStr)}
                    className={
                      "calendar-day relative p-2 text-sm rounded-xl transition " +
                      (isThisMonth ? "text-gray-700 hover:bg-pink-100 " : "text-gray-300 ") +
                      (isToday ? "bg-pink-500 text-white " : "")
                    }
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    aria-label={`${date.getMonth() + 1}月${date.getDate()}日`}
                  >
                    {date.getDate()}
                    {hasEvents && <div className="event-dot" />}
                  </motion.button>
                );
              })}
            </div>

            {selectedEvents && (
              <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
                <h4 className="font-bold text-lg mb-2">選択された日のイベント</h4>
                <div>
                  {selectedEvents.map((ev, idx) => (
                    <motion.div
                      key={idx}
                      className="bg-white p-3 rounded-xl mb-2 shadow-sm flex items-center justify-between"
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.35 }}
                    >
                      <div>
                        <div className="font-semibold">{ev.name}</div>
                        <div className="text-sm text-gray-600">
                          {ev.time} | {ev.location}
                        </div>
                      </div>
                      <span className="text-2xl">{ev.icon}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </Reveal>

        {/* ===== おすすめ飲食店 ===== */}
        <Reveal>
          <section className="motion-card p-6 shadow-xl mb-8">
            <h3 className="text-2xl font-extrabold text-pink-600 mb-4 flex items-center">
              <span className="mr-2">🍽️</span>おすすめ飲食店
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: ", rate: "★★★★★ 4.8", genre: "本格懐石料理", price: "¥¥¥¥" },
                { name: "地獄谷カフェ", rate: "★★★★☆ 4.3", genre: "カフェ・スイーツ", price: "¥¥" },
                { name: "登別ラーメン横丁", rate: "★★★★☆ 4.6", genre: "ラーメン・麺類", price: "¥¥" }
              ].map((r, i) => (
                <motion.div
                  key={r.name}
                  className="bg-white p-6 rounded-2xl shadow-lg"
                  initial={{ scale: 0.96, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-lg text-gray-800">{r.name}</h4>
                    <div className="text-yellow-500">{r.rate}</div>
                  </div>
                  <p className="text-gray-600 mb-2">{r.genre}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-pink-600 font-semibold">{r.price}</span>
                    <motion.button
                      className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      詳細を見る
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ===== お知らせ ===== */}
        <Reveal>
          <section className="motion-card p-6 shadow-xl">
            <h3 className="text-2xl font-extrabold text-pink-600 mb-4 flex items-center">
              <span className="mr-2">📢</span>お知らせ・新着情報
            </h3>

            {[
              { color: "pink",  title: "春の特別イベント開催決定！", date: "2024.04.10",
                body: "4月20日〜5月5日まで、登別温泉街で春の特別イベントを開催します。" },
              { color: "blue",  title: "新しい飲食店がオープン", date: "2024.04.08",
                body: "温泉街に新しいカフェ「湯けむりテラス」がオープンしました。" },
              { color: "green", title: "サイトリニューアルのお知らせ", date: "2024.04.01",
                body: "LOVEりべつポータルサイトがリニューアルしました。" },
            ].map((n, i) => (
              <motion.div
                key={i}
                className={`border-l-4 pl-4 py-2 ${
                  n.color === "pink" ? "border-pink-500" : n.color === "blue" ? "border-blue-500" : "border-green-500"
                }`}
                initial={{ x: -12, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800">{n.title}</h4>
                  <span className="text-xs text-gray-500">{n.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{n.body}</p>
              </motion.div>
            ))}
          </section>
        </Reveal>
      </main>

      {/* ========= Footer ========= */}
      <footer className="bg-white/90 backdrop-blur-sm mt-16 py-8">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <div className="flex justify-center items-center space-x-3 mb-3">
            <span className="text-3xl">♨️</span>
            <h3 className="text-2xl font-extrabold text-pink-600">LOVEりべつ</h3>
            <span className="text-3xl">💕</span>
          </div>
          <div className="text-xs text-gray-400">© 2024 LOVEりべつ</div>
        </div>
      </footer>
    </div>
  );
}








