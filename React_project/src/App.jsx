import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/message')
      .then(res => setMessage(res.data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '20px', fontSize: '1.5rem' }}>
      <p>{message || '読み込み中...'}</p>
    </div>
  );
}

export default App;
