import React from 'react';
import { Link } from 'react-router-dom';

const EventRegistrationError = () => {
  const buttonStyle = {
    backgroundColor: '#F93D5D',
    color: 'white',
    padding: '10px 20px',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    display: 'inline-block'
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2 style={{ color: '#555' }}>エラーが発生しました</h2>
      <p>このリンクは無効か、有効期限が切れている可能性があります。</p>
      <p>もう一度、最初から申請をやり直してください。</p>
      
      <div style={{ marginTop: '30px' }}>
        <Link to="/EventForm" style={buttonStyle}>
          イベント投稿画面へ戻る
        </Link>
      </div>
    </div>
  );
};

export default EventRegistrationError;