<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8">
        <title>パスワード再設定</title>
        </head>
        <body>

            <h1>パスワード再設定</h1>

            <form id="resetForm">

            <!--「この入力欄は何のためか」を説明するラベル。for属性は、対応する入力欄のIDを指定します。-->

            <label for="current-password">現在のパスワード</label><br>
            <!--パスワード入力欄。入力した文字は「●」などで隠されます。-->

            <input type="password" id="current-password"><br><br>

            <label for="confirm-password">新規パスワード（確認用）</label><br>
            <label type="password" id="confirm-password"><br><><br>

            <label for="email">メールアドレス（送信用）</label><br>
            <input type="email" id="email" value="hello@reallygreatsite.com"><br><br>

            <button type="submit">再設定</button>
            </form>

            <script>
                document.getElementById("reaetForm").addEventListener("submit",function(event)){
                    event.prevertDefault();

                    const current=document.getElementById("current-password").value;
                    cost newPw=document.getElementById("new-password").value;
                    cost confirmPw=document.getElementById("confirm-password").value;
                    cost email=document.getElementById("email").value;

                    if(!current || !newPw || !confirmPw || !email){
                        alert("全ての項目を入力してください");
                        return;
                    }

                    <!--5 !== 5       // false（値も型も同じ → 一致している）-->
                    <!--5 !== "5"     // true（値は同じでも型が違う → 不一致--->
                    <!--//"abc" !== "def" // true（値が違う → 不一致）-->

                    <!--パスワード一致チェック-->
                    if(newPw !== confirmPw){
                        alert("新規パスワードと確認用パスワードと一致しません。");
                        return;
                    }

                    <!--パスワード条件チェック（英大小文字+記号+数字+記号)-->
                    cost pwRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#?$%&]).{8,}$/;
                    if(!pwRegex.test(newPw)){
                        alert("パスワードは英大小文字、数字、記号を含む8文字以上で入力してください。");
                        return
                    }


                    <!--成功メッセージ-->
                    alert("パスワード再設定を受付けました!");
                    });
                    </script>

                    </body>
                    </html>
                    