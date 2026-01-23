//メールアドレス変更確定
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


//メアド変更確定
const EmailChangeConfirm = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
    const [message, setMessage] = useState('メールアドレスを確認中...');
    const navigate = useNavigate();

    useEffect(() => {
        const confirmChange = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                setMessage('無効なアクセスです。トークンが見つかりません。');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8000/api/email-change/confirm?token=${token}`);
                
                setStatus('success');
                setMessage(response.data.message);
                
                //3秒後にログイン画面へ飛ばす
                setTimeout(() => navigate('/login'), 3000);

            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'エラーが発生しました。リンクの期限が切れている可能性があります。');
            }
        };

        confirmChange();
    }, [searchParams, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 style={{ color: '#F93D5D' }}>Loveりべつ</h2>
            
            {status === 'processing' && <p>{message}</p>}
            
            {status === 'success' && (
                <div>
                    <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>
                    <p>3秒後にログイン画面へ移動します...</p>
                </div>
            )}
            
            {status === 'error' && (
                <div>
                    <p style={{ color: 'red' }}>{message}</p>
                    <button onClick={() => navigate('/login')}>ログイン画面へ戻る</button>
                </div>
            )}
        </div>
    );
};

export default EmailChangeConfirm;