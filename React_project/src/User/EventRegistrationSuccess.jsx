import { Link } from 'react-router-dom';

const EventRegistrationSuccess = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2 style={{ color: '#F93D5D' }}>メール認証が完了しました！</h2>
      <p>イベントの掲載申請を受け付けました。</p>
      <p>現在は管理者が内容を確認しております。<br />承認されるとカレンダーに表示されますので、しばらくお待ちください。</p>
      
      <div style={{ marginTop: '30px' }}>
        <Link to="/mypage" style={buttonStyle}>マイページで状況を確認する</Link>
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
  fontWeight: 'bold'
};

export default EventRegistrationSuccess;