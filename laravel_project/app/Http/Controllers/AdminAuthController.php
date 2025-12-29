<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
            if ($user->role === 'admin') {
                return response()->json([
                    'message' => 'admin login success'
                ], 200);
            }

            // 管理者じゃない場合
            return response()->json([
                'message' => 'not admin'
            ], 403);
        }

        return response()->json([
            'message' => 'login failed'
        ], 401);
    }
}