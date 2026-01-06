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
        .status-badge {
            background-color: #4caf50;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>店舗情報の掲載が承認されました！</h2>
        <p>「Loveりべつ」への掲載申請ありがとうございます。</p>
        <p>申請いただいた店舗情報が承認され、サイトへ公開されました。</p>

        <div class="event-info">
            <strong>掲載された店舗：</strong><br>
            {{ $restaurant_name }} <span class="status-badge" style="background-color: #4caf50;">公開中</span>
        </div>
        
        <p style="text-align: center;">
            <a href="{{ $url }}" class="button">店舗ページを確認する</a>
        </p>
    </div>
</body>
</html>