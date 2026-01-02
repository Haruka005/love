<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <style>
        .button {
            background-color: #F93D5D; 
            color: white !important;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .container {
            font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .event-info {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>イベント掲載の申請ありがとうございます！</h2>
        <p>「Loveりべつ」へイベント情報の投稿ありがとうございます。</p>
        <p>まだ申請は完了しておりません。下のボタンをクリックして、メール認証を完了させてください。</p>
        <p>認証完了後、管理者が内容を確認し、問題がなければサイトへ掲載されます。</p>

        <div class="event-info">
            <strong>投稿されたイベント：</strong><br>
            {{ $event_name }}
        </div>
        
        <p style="text-align: center;">
            <a href="{{ $url }}" class="button">申請を完了して審査へ送る</a>
        </p>

        <p>※このリンクの有効期限は24時間です。<br>
        ※本メールに心当たりがない場合は、このメールを破棄してください。</p>

        <div class="footer">
            <p>--------------------------------------------------</p>
            <p>Loveりべつ 運営チーム</p>
        </div>
    </div>
</body>
</html>