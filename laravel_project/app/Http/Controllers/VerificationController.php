<?php
// メール認証コード送信コントローラー
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Verification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
// use App\Mail\VerificationCodeMail; // 後で作成するメールクラス

class EmailVerificationController extends Controller
{
    public function sendVerificationCode(Request $request)
    {
        // 1.バリデーション（メールアドレスの形式チェック）
        $request->validate([
            'email' => 'required|email',
        ]);

        // 2. 6桁のコードを生成
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // 3. DBに保存（または更新）
        // verification_codesテーブルに、emailをキーとして保存
        EmailVerification::updateOrCreate(
            ['email' => $request->email], 
            [
                'code' => $code,
                'expires_at' => Carbon::now()->addMinutes(30), // 30分間有効
            ]
        );

        // 4. メール送信（Mailクラスを作ったらコメントを外す）
        // Mail::to($request->email)->send(new VerificationCodeMail($code));

        return response()->json([
            'message' => '認証コードを送信しました',
            'debug_code' => $code // 開発中はこれを出しておくとメールを見なくて済むので楽
        ]);
    }
}

