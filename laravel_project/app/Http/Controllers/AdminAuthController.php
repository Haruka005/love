<?php

//管理者用ユーザー認証コントローラー
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use App\Models\Token;
use App\Models\User;
use App\Mail\AdminLoginVerifyMail;
use Carbon\Carbon;

class AdminAuthController extends Controller
{
    /**
     * ログイン処理
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();

        // 1. ユーザー存在・パスワードチェック
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'ログイン情報が正しくありません'], 401);
        }

        // 2. 管理者権限チェック
        if ($user->role !== 'admin') {
            return response()->json(['message' => '管理者権限がありません'], 403);
        }

        // 3. アカウント停止・ロックのチェック
        if ($user->user_status === 0) {
            return response()->json(['message' => 'このアカウントは停止されています'], 403);
        }

        // 4. 7日間認証のロジック
        if ($user->last_login_verified_at) {
            $lastVerified = Carbon::parse($user->last_login_verified_at);
            if ($lastVerified->diffInDays(now()) < 7) {
                return $this->issueToken($user);
            }
        }

        // 5. 認証コード生成と送信
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $user->forceFill(['remember_token' => $code])->save();

        Mail::to($user->email)->send(new AdminLoginVerifyMail($code));

        return response()->json([
            'needs_verification' => true,
            'message' => '認証コードを送信しました'
        ], 200);
    }

    /**
     * 認証コードの検証
     */
    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|size:6'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || $user->remember_token !== $request->code) {
            return response()->json(['message' => 'コードが正しくありません'], 422);
        }

        // 認証成功時に「last_login_verified_at」を更新
        $user->forceFill([
            'remember_token' => null,
            'last_login_verified_at' => now()
        ])->save();

        return $this->issueToken($user);
    }

    /**
     * トークン発行（オンライン状態の開始）
     */
    private function issueToken($user)
    {
        
        Token::where('user_id', $user->id)->delete();

        $token = bin2hex(random_bytes(32));
        Token::create([
            'user_id' => $user->id,
            'token' => $token,
            'token_expires_at' => now()->addHours(8),
            'last_used_at' => now(),
        ]);

        return response()->json([
            'needs_verification' => false,
            'token' => $token,
            'admin' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email
            ]
        ], 200);
    }

    /**
     * ログアウト処理
     */
    public function logout(Request $request)
    {
        $tokenString = $request->bearerToken();

        if ($tokenString) {
            Token::where('token', $tokenString)->delete();
        }

        return response()->json(['message' => 'ログアウトしました'], 200);
    }
}

