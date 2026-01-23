<?php
// 通報機能コントローラー
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ReportController extends Controller
{
    public function sendReport(Request $request)
    {
        $validated = $request->validate([
            'name'   => 'nullable|string|max:255',
            'email'  => 'required|email',
            'reason' => 'required|string',
        ]);

        $userEmail = $validated['email'];
        $userName  = $validated['name'] ?? '利用者';
        $adminEmail = "hc43.loveribetsu@gmail.com"; // 管理者のアドレス

        // 2. 管理者への通知メール
        Mail::raw(
            "通報がありました。\n\n" .
            "名前: " . $userName . "\n" .
            "メール: " . $userEmail . "\n" .
            "理由: \n" . $validated['reason'],
            function ($message) use ($adminEmail) {
                $message->to($adminEmail)
                        ->subject('【管理者通知】通報フォームから新しい通知があります');
            }
        );

        // 3. 送信者（ユーザー）への自動返信メール
        Mail::raw(
            "{$userName} 様\n\n" .
            "LOVEりべつをご利用いただきありがとうございます。\n" .
            "通報を以下の内容で受理いたしました。\n\n" .
            "---------------------------------\n" .
            "理由:\n" . $validated['reason'] . "\n" .
            "---------------------------------\n\n" .
            "運営にて内容を確認し、順次対応させていただきます。\n\n" .
            "※本メールはシステムより自動送信されています。\n" .
            "※もし本メールに心当たりがない場合や、間違いメールの場合は、大変お手数ですが本メールを破棄していただくか、上記運営アドレスまでご連絡ください。",
            function ($message) use ($userEmail) {
                $message->to($userEmail)
                        ->subject('【LOVEりべつ】通報完了のお知らせ');
            }
        );

        return response()->json(['message' => '通報を受理し、確認メールを送信しました'], 200);
    }
}

