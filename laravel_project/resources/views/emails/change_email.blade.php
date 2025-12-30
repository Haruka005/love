<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <style>
        .button {
            background-color: #F93D5D;
            color: white !important;
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
    <h2>メールアドレス変更のリクエストを承りました</h2>
    <p>いつも「Loveりべつ」をご利用いただきありがとうございます。</p>
    <p>以下のボタンをクリックして、新しいメールアドレスへの変更を完了させてください。</p>
    
    <p style="margin: 30px 0;">
        <a href="{{ $url }}" class="button" style="color: white; text-decoration: none;">メールアドレスを確定する</a>
    </p>

    <p>※このリンクの有効期限は24時間です。<br>
    ※本メールに心当たりがない場合は、第三者がメールアドレスを誤入力した可能性があります。その場合はこのメールを破棄してください（メールアドレスは変更されません）。</p>

    <div class="footer">
        <p>--------------------------------------------------</p>
        <p>Loveりべつ 運営チーム</p>
    </div>
</body>
</html>