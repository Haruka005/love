// Reactライブラリから useState（状態管理用のフック）を読み込む
import React, { useState } from "react";

// React Router の useNavigate を読み込むことで、ページ遷移ができるようになる
import { useNavigate } from "react-router-dom";

// イベント申請フォームのコンポーネント定義（関数型コンポーネント）
function EventForm() {
  // useStateを使ってフォームの入力状態を管理する
  const [formData, setFormData] = useState({
    name: "",                   // イベント名
    catchphrase: "",            // 見出し
    start_date: "",             // 開始日
    end_date: "",               // 終了日
    location: "",               // 開催場所
    is_free_participation: "",  // 予約の有無（要予約 or 自由参加）
    url: "",                    // イベントの公式URL
    organizer: "",              // 主催者名
    details: "",                // イベントの詳細説明
    notes: "",                  // 注意事項
  });

  // ページ遷移に使う関数。navigate("/MyPage") でマイページに移動できる
  const navigate = useNavigate();

  // 入力欄が変更されたときに呼ばれる関数
  const handleChange = (e) => {
    const { name, value } = e.target; // 入力欄のname属性とvalueを取得
    setFormData((prev) => ({
      ...prev,               // 既存のformDataをコピー
      [name]: value,         // 該当項目だけ新しい値に更新
    }));
  };

  // JSX（ReactのHTMLのような構文）を返す
  return (
    <div
      style={{
        position: "relative",       // ✕ボタンの絶対配置の基準にする
        padding: "20px",            // 全体の余白
        fontFamily: "sans-serif",   // フォント指定
        maxWidth: "500px",          // 横幅制限
        margin: "0 auto",           // 中央寄せ
      }}
    >
      {/* ✕ 閉じるボタン（画面左上に固定表示） */}
      <button
        onClick={() => navigate("/MyPage")} // マイページに遷移する
        style={{
          position: "absolute",     // 親divを基準に左上に配置
          top: "10px",
          left: "10px",
          backgroundColor: "#eee",  // 薄いグレー背景
          color: "#333",            // 濃いグレー文字
          border: "none",           // 枠なし
          borderRadius: "50%",      // 丸型にする
          width: "40px",
          height: "40px",
          fontSize: "20px",         // ✕マークのサイズ
          cursor: "pointer",        // ポインター表示
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)", // 影をつけて浮かせる
          zIndex: 1000,             // 他の要素より前面に表示
        }}
      >
        ✕
      </button>

      {/* ページタイトル */}
      <h2 style={{ textAlign: "center", marginTop: "0" }}>イベント申請</h2>

      {/* 見出し画像の仮表示エリア */}
      <div
        style={{
          width: "100%",
          height: "150px",
          backgroundColor: "#ddd",
          borderRadius: "6px",
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
        }}
      >
        見出し画像（仮）
      </div>

      {/* 画像アップロードボタン（仮） */}
      <button
        onClick={() => alert("画像アップロード処理をここに追加")}
        style={{
          display: "block",
          margin: "0 auto 20px",
          padding: "10px 20px",
          backgroundColor: "#ccc",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        UPLOAD
      </button>

      {/* テキスト入力欄（予約以外）をまとめて表示 */}
      {[
        { label: "タイトル", name: "name" },
        { label: "見出し", name: "catchphrase" },
        { label: "開始日", name: "start_date" },
        { label: "終了日", name: "end_date" },
        { label: "場所", name: "location" },
        { label: "URL", name: "url" },
        { label: "主催者", name: "organizer" },
      ].map((field) => (
        <div key={field.name} style={{ marginBottom: "10px" }}>
          <label>{field.label}</label><br />
          <input
            type="text"                 // テキスト入力欄
            name={field.name}          // 状態更新に使うキー
            value={formData[field.name]} // 現在の値を表示
            onChange={handleChange}    // 入力変更時の処理
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
      ))}

      {/* 予約欄（プルダウン形式） */}
      <div style={{ marginBottom: "10px" }}>
        <label>予約</label><br />
        <select
          name="is_free_participation" // 状態更新に使うキー
          value={formData.is_free_participation} // 現在の選択値を表示
          onChange={handleChange} // 選択変更時の処理
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">選択してください</option>
          <option value="要予約">要予約</option>
          <option value="自由参加">自由参加</option>
        </select>
      </div>

      {/* 詳細欄（複数行のテキスト入力） */}
      <div style={{ marginBottom: "10px" }}>
        <label>詳細</label><br />
        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
          rows="3"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* 注意事項欄（複数行のテキスト入力） */}
      <div style={{ marginBottom: "20px" }}>
        <label>注意事項</label><br />
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* 申請ボタン（クリックするとアラート表示） */}
      <button
        onClick={() => alert("申請内容を送信しました")}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#a1a5a1ff", // グレー系の背景色
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        申請する
      </button>
    </div>
  );
}

// 他のファイルからこのコンポーネントを使えるようにする
export default EventForm;