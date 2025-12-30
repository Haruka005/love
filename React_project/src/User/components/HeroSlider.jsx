import React, { useState, useEffect } from "react";

import img1 from "../images/登別マリンパークニクス.jpg";
import img2 from "../images/登別観光.jpeg";

function HeroSlider(){

    const images = [img1, img2];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000); 
        return () => clearInterval(timer);
    }, [images.length]);

  return (
    <div className="hero-slider" style={{ 
        position: "relative", 
        width: "100%", 
        height: "60vh", // ← ここで高さを指定（画面の高さの60%分）
        overflow: "hidden",
        backgroundColor: "#eee" 
    }}>

        {/* 画像切り替え */}
        {images.map((img, index) => (
            <div
                key={index}
                className={`slide ${index === currentIndex ? "active" : ""}`}
                style={{ 
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${img})`,
                    backgroundSize: "cover",      // 画像を枠いっぱいに広げる
                    backgroundPosition: "center", // 真ん中を中心に表示
                    opacity: index === currentIndex ? 1 : 0, // 重なりを制御
                    transition: "opacity 1s ease-in-out",    // ふわっと切り替える
                    zIndex: index === currentIndex ? 1 : 0
                }}
            ></div>
        ))}

        {/* テキストが必要な場合はここを解除 */}
        {/* <div className="hero-text" style={{ position: "absolute", zIndex: 10 }}>
            <h1>Welcome to Loveりべつ</h1>
            <p>登別の魅力を再発見！</p>
        </div>
        */}
    </div>
  );
}

export default HeroSlider;