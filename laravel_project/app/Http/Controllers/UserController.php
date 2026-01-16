<?php
//ユーザーアカウント管理機能
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Token;
use App\Mail\WelcomeMail; //メールの設計図を読み込む
use Illuminate\Support\Facades\Mail; //メール送信機能を使う
use Illuminate\Support\Facades\URL; //署名付きURL生成
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Mail\ResetPasswordMail;
use App\Mail\ChangeEmailMail;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // 新規登録
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:12',
                'regex:/[A-Z]/', // 大文字
                'regex:/[a-z]/', // 小文字
                'regex:/[0-9]/', // 数字
                'regex:/[!@&?]/', // 記号
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '入力エラーがあります',
                'errors' => $validator->errors()
            ], 422);
        }

        \Log::info('バリデーション通過');

        try {
            return DB::transaction(function () use ($request) {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'user_status' => 1,
                ]);

                \Log::info('ユーザー作成成功: ID ' . $user->id);

                // 認証用URLを発行
                $verificationUrl = URL::temporarySignedRoute(
                    'verification.verify', // api.phpで設定する名前
                    now()->addMinutes(60), // 有効期限（60分）
                    [
                        'id' => $user->id,
                        'hash' => sha1($user->getEmailForVerification()),
                    ]
                );

                \Log::info('メール送信開始');

                // メールを送信
                Mail::to($user->email)->send(new WelcomeMail($user, $verificationUrl));

                \Log::info('メール送信命令が正常に完了しました');
            });
        } catch (\Exception $e) {
            \Log::error('エラー発生: ' . $e->getMessage());
            \Log::error('エラーの場所: ' . $e->getFile() . ' の ' . $e->getLine() . '行目');

            return response()->json(['message' => 'サーバーエラーが発生しました'], 500);
        }

        return response()->json(['message' => '登録完了'], 201);
    }

    // ログイン
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '入力エラーがあります',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'メールアドレスまたはパスワードが違います'], 401);
        }

        // ロックチェック
        if ($user->is_locked) {
            $lockDuration = 5; // 5分ロック
            if ($user->locked_at && $user->locked_at->addMinutes($lockDuration)->isFuture()) {
                return response()->json(['message' => 'アカウントがロック中です'], 403);
            } else {
                $user->is_locked = false;
                $user->login_attempts = 0;
                $user->locked_at = null;
                $user->save();
            }
        }

        // 認証チェック
        if (Hash::check($request->password, $user->password)) {
            $token = bin2hex(random_bytes(32));

            \Log::info('ログイン成功、トークン発行', ['user_id' => $user->id, 'token' => $token]);

            Token::create([
                'user_id' => $user->id,
                'token' => $token,
                'token_expires_at' => now()->addHour(1),
                'last_used_at' => now(),
            ]);

            \Log::info('トークン保存完了', ['token' => $token]);

            return response()->json([
                'message' => 'ログイン成功',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ], 200);
        } else {
            $user->login_attempts += 1;

            if ($user->login_attempts >= 5) {
                $user->is_locked = true;
                $user->locked_at = now();
            }

            $user->save();

            $msg = $user->is_locked
                ? 'アカウントロックしました'
                : 'メールアドレスまたはパスワードが違います';

            return response()->json(['message' => $msg], 401);
        }
    }

    // 現在ログイン中のユーザー情報
    public function me(Request $request)
    {
        $authHeader = $request->header('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            Log::warning('認証ヘッダーがありません。');
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $tokenValue = substr($authHeader, 7);

        $tokenRecord = Token::where('token', $tokenValue)
            ->where('token_expires_at', '>', now())
            ->first();

        if (!$tokenRecord) {
            Log::warning('無効または期限切れのトークンです。', ['token' => $tokenValue]);
            return response()->json(['message' => 'Unauthenticated. Invalid token.'], 401);
        }

        $user = $tokenRecord->user;
        $tokenRecord->update(['last_used_at' => now()]);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ], 200);
    }

    // パスワード再発行
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'email' => $request->email,
                'token' => Hash::make($token),
                'created_at' => Carbon::now(),
                'expires_at' => now()->addMinutes(60),
            ]
        );

        $resetUrl = "http://localhost:3000/password-reset?token=" . $token . "&email=" . $request->email;
        Mail::to($request->email)->send(new ResetPasswordMail($resetUrl));

        return response()->json(['message' => '再設定メールを送信しました。']);
    }

    // パスワードの再設定
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:12|confirmed',
        ]);

        $resetData = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (!$resetData || !Hash::check($request->token, $resetData->token)) {
            return response()->json(['message' => 'トークンが無効です。'], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'パスワードを再設定しました。']);
    }

    public function requestChange(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'new_email' => 'required|email|unique:users,email',
            'password' => 'required',
        ]);

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Password mismatch'], 401);
        }

        DB::table('t_email_change_requests')->where('user_id', $user->id)->delete();

        $token = Str::random(64);

        DB::table('t_email_change_requests')->insert([
            'user_id' => $user->id,
            'new_email' => $request->new_email,
            'token' => $token,
            'created_at' => now(),
            'expires_at' => now()->addHours(24),
        ]);

        $link = url("/api/email-change/confirm?token={$token}");
        Mail::to($request->new_email)->send(new ChangeEmailMail($link));

        return response()->json(['message' => '確認メールを送信しました']);
    }

    public function confirmChange(Request $request)
    {
        $token = $request->query('token');

        $requestData = DB::table('t_email_change_requests')
            ->where('token', $token)
            ->where('expires_at', '>', now())
            ->first();

        if (!$requestData) {
            return response()->json(['message' => 'トークンが無効か、期限切れです'], 400);
        }

        $user = User::find($requestData->user_id);
        if ($user) {
            $user->email = $requestData->new_email;
            $user->save();
        }

        DB::table('t_email_change_requests')->where('token', $token)->delete();

        return redirect('http://localhost:3000/email-change-success');
    }
}
