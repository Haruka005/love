<!DOCTYPE html>
<html>
<head><title>ログイン認証コード</title></head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333;">
    <h2>管理者ログイン認証</h2>
    <p>システムへのログインが試行されました。以下の認証コードを入力してログインを完了してください。</p>
    <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 10px;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #f35;">
            {{ $code }}
        </span>
    </div>
    <p>※このコードは30分間有効です。<br>
    ※一度認証すると、同じブラウザからのログインは7日間省略されます。</p>
    <hr>
    <p style="font-size: 12px; color: #999;">心当たりがない場合は、このメールを破棄してください。</p>
</body>
</html>