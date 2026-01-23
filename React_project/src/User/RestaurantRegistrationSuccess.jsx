import React from 'react';
import { Link } from 'react-router-dom';


//店舗登録成功画面
const RestaurantRegistrationSuccess = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2 style={{ color: '#F93D5D' }}>メール認証が完了しました！</h2>
      <p>店舗情報の掲載申請を受け付けました。</p>
      <p>
        現在は管理者が内容を確認しております。<br />
        承認されると店舗一覧に表示されますので、しばらくお待ちください。
      </p>
      
      <div style={{ marginTop: '30px' }}>
        <Link to="/MyPage" style={buttonStyle}>
          マイページで状況を確認する
        </Link>
      </div>
      <div style={{ marginTop: '15px' }}>
        <Link to="/" style={{ color: '#777' }}>
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: '#F93D5D',
  color: 'white',
  padding: '10px 20px',
  textDecoration: 'none',
  borderRadius: '5px',
  fontWeight: 'bold',
  display: 'inline-block' 
};

export default RestaurantRegistrationSuccess;