const { useState } = React;

const ProfileCard = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div style={{
      margin: '2rem',
      padding: '2rem',
      borderRadius: '15px',
      background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      color: '#333',
      maxWidth: '400px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    }}>
      <h1>こんにちは！🌟</h1>
      <p><strong>名前：</strong>しみず げんき</p>
      <p><strong>趣味：</strong>プログラミング、音楽、旅行</p>
      {showMore && (
        <>
          <p><strong>好きな言語：</strong>JavaScript, Python</p>
          <p><strong>夢：</strong>世界を感動させるアプリを作ること！</p>
        </>
      )}
      <button
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: 'none',
          background: '#fff',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? '閉じる' : 'もっと見る'}
      </button>
    </div>
  );
};

ReactDOM.render(<ProfileCard />, document.getElementById('root'));