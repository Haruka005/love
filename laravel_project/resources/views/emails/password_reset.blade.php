<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <style>
        .button {
            background-color: #F93D5D;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
            font-weight: bold;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <h2>パスワード再設定のリクエストを承りました</h2>
    <p>いつも「Loveりべつ」をご利用いただきありがとうございます。</p>
    <p>以下のボタンをクリックして、パスワードの再設定を完了させてください。</p>
    
    
    <p style="margin: 30px 0;">
        <a href="{{ $resetUrl }}" class="button">パスワードを再設定する</a>
    </p>

    <p>※このリンクの有効期限は60分です。<br>
    ※心当たりがない場合は、このメールを破棄してください。</p>

    <div class="footer">
        <p>--------------------------------------------------</p>
        <p>Loveりべつ 運営チーム</p>
    </div>
</body>
</html>