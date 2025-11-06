import React, { useState, useEffect } from "react";

import img1 from "../images/登別マリンパークニクス.jpg";
import img2 from "../images/登別観光.jpeg";

function HeroSlider(){

    const images = [img1, img2];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
        //セットされた秒数ごとに処理を繰り返す setInterval()はJS標準のタイマー機能
            setCurrentIndex((prevIndex) =>
            //画像番号を更新
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
                //最後まで行ったら0に戻る
            );
        }, 5000); // ← 5秒ごとに切り替え
        return () => clearInterval(timer);
        //タイマーを止める処理　これがないと裏で動き続けるからメモリ食う
    },[]);

  return (
    <div className="hero-slider">

        {/* 画像切り替え */}
        {images.map((img, index) => (
            <div
            key={index}
            className={`slide ${index === currentIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${img})` }}
            ></div>
        ))}

        {/* テキスト */}
        <div className="hero-text">
            <h1>Welcome to Loveりべつ</h1>
            <p>登別の魅力を再発見！</p>
        </div>
    </div>
  );
}

export default HeroSlider;