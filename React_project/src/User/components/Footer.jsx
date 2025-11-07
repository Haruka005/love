import React from "react";

function Footer() {
  const footerStyle = {
    backgroundColor: "#ffffffff",    //背景色
    padding: "20px",                   //中の文字と境界線のスペース（上下20px、左右0）
    textAlign: "center",               //テキストを中央揃えにする
    bottom: 0,                         //一番下に配置する
    left: 0,                           //画面の左端から配置を開始する
    width: "100%",                     //横幅全体に広げる
    borderTop: "1px solid #ffffffff",//フッターの上に細い線を入れる
    marginTop: "40px",                 //コンテンツとのスキマ
    fontSize: "14px",                  //フォントサイズ
    color: "#555",                   //テキストの色
  };

  return (
    <footer style={footerStyle}>
      <p>Loveりべつ</p>
    </footer>
  );
}

export default Footer;
