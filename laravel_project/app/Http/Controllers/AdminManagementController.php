<?php

//管理者新規登録するコントローラー

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class AdminManagementController extends Controller
{
    /**
     * 管理者画面からのユーザー/管理者新規作成
     */
    public function store(Request $request)
    {
        // ログ出力（デバッグ用）
        Log::info('管理者による新規作成:', $request->all());

        // バリデーション
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role'     => 'required|in:admin,user', // admin か user のみ許可
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '入力内容に不備があります。',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            // ユーザー作成
            $user = User::create([
                'name'              => $request->name,
                'email'             => $request->email,
                'password'          => Hash::make($request->password),
                'role'              => $request->role,   // 管理者画面で選んだ role
                'user_status'       => 1,                // アクティブ状態
                'email_verified_at' => now(),            // 管理者作成なのでメール認証をパスさせる
            ]);

            return response()->json([
                'message' => 'アカウントの作成に成功しました。',
                'user'    => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'role'  => $user->role,
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('アカウント作成エラー: ' . $e->getMessage());
            return response()->json([
                'message' => 'サーバーエラーが発生しました。'
            ], 500);
        }
    }
}