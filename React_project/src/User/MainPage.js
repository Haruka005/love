// ---------------------- 必要なライブラリの読み込み ----------------------

// React本体とフック(useState)を読み込む
// useStateはコンポーネント内で値（状態）を保持・更新するために使います
import React, { useState,useEffect } from "react";

// リンク切り替え用のコンポーネントを読み込む（ページ遷移を行う）
import { Link } from "react-router-dom";


// ---------------------- 表示データ（サンプル） ----------------------

// ジャンル別の飲食店データ（簡易サンプル）
const shopDataByGenre = {
  "洋食": [
    { title: "登別美味しい洋食" },
    { title: "洋風ダイニング登別" }
  ],
  "定食": [
    { title: "登別定食屋" },
    { title: "ソーダかもしれない食堂" }
  ],
  "デザート": [
    { title: "登別スイーツカフェ" },
    { title: "温泉プリン専門店" }
  ]
};

// 直近イベント（カード表示用の画像付きサンプル）
const events = [
  {
    date: "2025-09-23",
    title: "秋の収穫祭",
    description: "地元野菜の販売と試食会",
    time: "10:00",
    image: "https://via.placeholder.com/300x200?text=秋の収穫祭"
  },
  {
    date: "2025-09-27",
    title: "登別陶芸体験教室",
    description: "土に触れて器づくりを体験",
    time: "13:00",
    image: "https://via.placeholder.com/300x200?text=陶芸体験"
  },
  {
    date: "2025-09-28",
    title: "登別地獄まつり",
    description: "鬼みこしや閻魔大王の練り歩きが見どころ",
    time: "19:00",
    image: "https://via.placeholder.com/300x200?text=地獄まつり"
  }
];


// ---------------------- コンポーネント本体 ----------------------

// ここからが画面（コンポーネント）の定義です。
// export default なので、このファイルを読み込むと MainPage コンポーネントが使えます。
export default function MainPage() {
  // ------------------ 状態（state）の定義 ------------------

  // イベント一覧
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(9);
  const [monthlyEvents, setMonthlyEvents] = useState([]); //[ここは取得したイベントいれる,ここは左の中身変えたいときに使う関数]空の配列に入れる
  const [error, setError] = useState(null);

  //ページを開いたときにAPI呼ぶ(useEffect)
  useEffect(() => {
    const fetchEvents = async () => { //async･･･awaitから結果帰ってくるまで次の処理しないで待つ
      try {

        //文字列の可能性があるselectedMonthを数値に変換
        const monthNumber = parseInt(selectedMonth, 10);

        const res = await fetch(
          `http://localhost:8000/api/events/${selectedYear}/${selectedMonth}`
        ); // await･･･結果取得できるまで次の処理しないで待つ
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

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


  // isOpen: ハンバーガーメニュー（右上の三本線）の開閉状態を保持する boolean
  // 初期は false（閉じている）
  const [isOpen, setIsOpen] = useState(false);

  // selectedGenre: 洋食／定食／デザート など、選択中の飲食ジャンルを保持
  // 初期は "洋食"
  const [selectedGenre, setSelectedGenre] = useState("洋食");

  // cardStyle: イベントや店舗カードで使う共通のスタイル（オブジェクト）
  // JSX の style にそのまま渡せます
  const cardStyle = {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  };


  // ------------------ 描画部分（JSX） ------------------
  return (
    // ここから画面全体（コンテナ）
    <div style={{ fontFamily: "sans-serif", color: "#000", backgroundColor: "#f5f5f5", paddingBottom: "40px" }}>

      {/* ------------------ ヘッダー ------------------ */}
      {/* ヘッダー全体の外枠 */}
      <header style={{ backgroundColor: "#fff", padding: "10px 20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        {/* ヘッダー内部を左右に配置するために flex を使用 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* サイトタイトル */}
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Loveりべつ</h1>
          {/* 将来的に右側にユーザー情報やボタンを追加できます（今は空） */}
        </div>
      </header>


      {/* ------------------ ハンバーガーメニュー（スマホ用） ------------------ */}
      <nav style={{ position: "relative", height: "60px" }}>
        {/* メニューボタン（≡）: クリックで isOpen を反転させる */}
        <button
          onClick={() => setIsOpen(!isOpen)} // クリックで true/false を切り替える
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "32px",
            background: "none",
            border: "none",
            color: "#000",
            cursor: "pointer"
          }}
          aria-label="メニューを開く"
        >
          ≡
        </button>

        {/* isOpen が true のときだけメニューを表示する（短絡評価） */}
        {isOpen && (
          <ul style={{
            position: "absolute",
            top: "50px",
            right: "10px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            listStyle: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            width: "200px",
            zIndex: 1000
          }}>
            {/* Link コンポーネントを使うとページ遷移時にページ全体をリロードしません */}
            <li><Link to="/">ホーム</Link></li>
            <li><Link to="/login">ログイン</Link></li>
            <li><Link to="/signup">サインアップ</Link></li>
            <li><Link to="/MyPage">マイページ</Link></li>
            <li><Link to="/ReportForm">問い合わせ・通報フォーム</Link></li>
            <li><Link to="/RestaurantDetail">飲食店詳細</Link></li>
            <li><Link to="/EventDetai">イベント詳細</Link></li>
          </ul>
        )}
      </nav>


      {/* ------------------ メインコンテンツ ------------------ */}
      <main style={{ padding: "20px" }}>

        {/* ---------- メインビジュアル（仮） ---------- */}
        <section style={{ marginBottom: "30px", textAlign: "center" }}>
          {/* 仮の大きな画像領域（本物の画像を入れる場合は <img> に差し替え） */}
          <div style={{
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto 20px",
            height: "500px",
            backgroundColor: "#ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px"
          }}>
            {/* 表示用テキスト（画像差し替え時に削除） */}
            <span style={{ fontSize: "48px", color: "#888" }}>画像挿入予定</span>
          </div>

          {/* ウェルカムテキスト */}
          <h2 style={{ fontSize: "50px", fontWeight: "bold", color: "#000" }}>ようこそ登別へ</h2>

          {/* 検索入力（まだ機能はついていない、見た目のため） */}
          <input
            type="text"
            placeholder="イベント・飲食を検索"
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              fontSize: "16px",
              width: "80%",
              maxWidth: "400px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              backgroundColor: "#fff",
              color: "#000"
            }}
            // 将来 onChange を使って検索機能を実装できます
          />
        </section>


        {/* ---------- 直近イベント（カード） ---------- */}
        <section style={{ marginBottom: "30px", textAlign: "center" }}>
          <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>直近のイベント</h3>

          {/* カードを横並びにして、画面幅に応じて折り返す */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
            {/* events 配列を map で回してカードを作る mapを使うことで何件データが来ても繰り返し表示できる */}
            {events.map((event, i) => (
              // key は配列をレンダリングする際に React が要素を識別するために必要
              <div key={i} style={cardStyle}>
                {/* 画像（サンプルURL） */}
                <img src={event.image} alt={event.title} style={{ width: "100%", borderRadius: "6px", marginBottom: "10px" }} />

                {/* イベントタイトル */}
                <h4 style={{ fontWeight: "bold", fontSize: "18px" }}>{event.title}</h4>

                {/* 日付・時間・説明 */}
                <p>開始日: {event.date}</p>
                <p>時間: {event.time}</p>
                <p style={{ fontSize: "14px", color: "#555" }}>{event.description}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ---------- 年・月別イベント（ここが複数年対応のポイント） ---------- */}
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


        {/* ---------- ジャンル別おすすめ飲食店 ---------- */}
        <section style={{ marginBottom: "30px", textAlign: "center" }}>
          <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>ジャンル別おすすめ飲食店</h3>

          {/* ジャンル切替ボタン群 */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
            {["洋食", "定食", "デザート"].map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)} // クリックでジャンルを更新
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: selectedGenre === genre ? "2px solid #101010" : "1px solid #ccc",
                  backgroundColor: selectedGenre === genre ? "#e0f0ff" : "#fff",
                  fontWeight: selectedGenre === genre ? "bold" : "normal",
                  cursor: "pointer"
                }}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* 選択ジャンルに基づいた店舗カード表示 */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
            {(shopDataByGenre[selectedGenre] || []).map((shop, i) => (
              <div key={i} style={cardStyle}>
                {/* 仮画像領域（実際は画像URLを入れて <img> に差し替え可能） */}
                <div style={{
                  width: "100%",
                  height: "180px",
                  backgroundColor: "#ddd",
                  borderRadius: "6px",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <span style={{ color: "#888", fontSize: "16px" }}>画像挿入予定</span>
                </div>

                {/* 店舗名表示 */}
                <h4 style={{ fontWeight: "bold", fontSize: "18px" }}>{shop.title}</h4>
              </div>
            ))}
          </div>
        </section>


        {/* ---------- 会員機能（仮の領域） ---------- */}
        <section style={{ marginBottom: "40px", textAlign: "center" }}>
          <h3 style={{ fontSize: "20px", marginBottom: "20px", color: "#333" }}>会員機能</h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", // 2列に並べる
            gap: "20px",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
                borderRadius: "8px",
                height: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#555",
                fontSize: "16px"
              }}>
                コンテンツ未定
              </div>
            ))}
          </div>
        </section>

      </main>


      {/* ------------------ フッター ------------------ */}
      <footer style={{ textAlign: "center", padding: "10px", backgroundColor: "#ddd" }}>
        {/* copyright を選択中の年に合わせて表示 */}
        <p>&copy; {selectedYear} Love登別観光情報</p>
      </footer>
    </div>
  );
}
