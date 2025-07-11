import React, { useState, useEffect } from 'react';
import logo from './anpan-man-.png';
import './App.css';
import Header from './Header';

function App() {
  const [position, setPosition] = useState({ top: 100, left: 100 });

  useEffect(() => {
    const interval = setInterval(() => {
      const newTop = Math.floor(Math.random() * (window.innerHeight - 150)); // 高さの範囲内
      const newLeft = Math.floor(Math.random() * (window.innerWidth - 150)); // 幅の範囲内
      setPosition({ top: newTop, left: newLeft });
    }, 1000); // 0.5秒ごとに位置変更

    return () => clearInterval(interval); // クリーンアップ
  }, []);

  return (
    <div className="App">
      <Header />
      <header className="App-header">
        <a
         href= "https://www.anpanman.jp/about/friends/4zvqlpab9ixejb6d.html"
         target="_blank"
         rel="noopener noreferrer"
        >
         <img
          src={logo}
          alt="anpan"
          className="Anpan"
          
          style={{
            position: 'absolute',
            top: `${position.top}px`,
            left: `${position.left}px`,
            transition: 'all 0.8s ease-in-out',
            zIndex: 10, // 数字が大きいほど手前に表示されてる
            cursor: 'pointer', // 視覚的にクリックできるように
            pointerEvents: 'auto'
          }}

         />
        </a>
        <p>アンパンマンをクリックして！</p>
      </header>
    </div>
  );
}

export default App;
