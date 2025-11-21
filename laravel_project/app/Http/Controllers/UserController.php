<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Token;

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

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_status' => 1,
        ]);

        return response()->json([
            'message' => '登録処理は成功しました',
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ]
        ], 201);
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

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'メールアドレスまたはパスワードが違います'], 401);
        }

        // 古いトークン削除（任意）
        Token::where('user_id', $user->id)->delete();

        // 新しいトークン発行
        $token = bin2hex(random_bytes(32));

        Token::create([
            'user_id' => $user->id,
            'token' => $token,
            'token_expires_at' => now()->addMinutes(30), // ← 有効期限30分
            'last_used_at' => now(),
        ]);

        return response()->json([
            'message' => 'ログイン成功',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ], 200);
    }

    // 現在のユーザー情報を返す
    public function me(Request $request)
    {
        $header = $request->header('Authorization');
        if (!$header || !preg_match('/Bearer\s+(.+)/', $header, $matches)) {
            return response()->json(['error' => 'Token required'], 401);
        }

        $token = $matches[1];
        $record = Token::where('token', $token)->first();

        if (!$record) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        if ($record->token_expires_at && now()->greaterThan($record->token_expires_at)) {
            return response()->json(['error' => 'Token expired'], 401);
        }

        $user = User::find($record->user_id);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ], 200);
    }
}