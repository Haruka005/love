<?php

//管理者用ユーザー一覧取得機能
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Token;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // 通常のユーザー認証
        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            // 管理者かどうかチェック
            if ($user->role !== 'admin') {
                return response()->json([
                    'message' => 'あなたは管理者ではありません'
                ], 403);
            }

            //  ユーザーと同じ独自トークン方式でトークン発行
            $token = bin2hex(random_bytes(32));

            Token::create([
                'user_id' => $user->id,
                'token' => $token,
                'token_expires_at' => now()->addHour(1),
                'last_used_at' => now(),
            ]);

            return response()->json([
                'message' => 'admin login success',
                'token' => $token,
                'admin' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ], 200);
        }

        return response()->json([
            'message' => 'login failed'
        ], 401);
    }
}