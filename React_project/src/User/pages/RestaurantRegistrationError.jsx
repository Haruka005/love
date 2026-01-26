import { Link } from 'react-router-dom';

//店舗登録エラー画面
const RestaurantRegistrationError = () => {
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
      <p>もう一度、最初から店舗登録をやり直してください。</p>
      
      <div style={{ marginTop: '30px' }}>
        <Link to="/RestaurantForm" style={buttonStyle}>
          店舗登録画面へ戻る
        </Link>
      </div>
    </div>
  );
};

export default RestaurantRegistrationError;