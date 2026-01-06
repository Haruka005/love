<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .container { padding: 20px; border: 1px solid #e3e3e0; border-radius: 8px; }
        h1 { color: #f53003; }
    </style>
</head>
<body>
    <div class="container">
        <h1>ご登録ありがとうございます！</h1>
        <p>以下のボタンをクリックして、メールアドレスの認証を完了してください。</p>
        <a href="{{ $url }}" style="background: #f53003; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            メールアドレスを認証する
        </a>
        <p>このリンクの有効期限は60分です。</p>    
    </div>
</body>
</html>