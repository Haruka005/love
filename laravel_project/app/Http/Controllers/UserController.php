<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Token;

class UserController extends Controller
{
    // ユーザー登録
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:12',
                'regex:/[A-Z]/',
                'regex:/[a-z]/',
                'regex:/[0-9]/',
                'regex:/[!@&?]/',
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '入力エラーがあります',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'user_status' => 1,
        ]);

        return response()->json([
            'message' => '登録処理は成功しました（仮）',
            'user'    => [
                'name'  => $user->name,
                'email' => $user->email,
            ]
        ], 201);
    }

    // ログイン処理
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '入力エラーがあります',
                'errors'  => $validator->errors()
            ], 422);
        }

        if (Auth::attempt($request->only('email', 'password'))) {
            $user  = Auth::user();
            $token = bin2hex(random_bytes(32));

            Token::create([
                'user_id'      => $user->id,
                'token'        => $token,
                'expires_at'   => now()->addHour(1),
                'last_used_at' => now(),
            ]);

            return response()->json([
                'message' => 'ログイン成功',
                'user'    => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                ]
            ], 200);
        }

        return response()->json([
            'message' => 'メールアドレスまたはパスワードが違います'
        ], 401);
    }

    // 【管理者用】ユーザー一覧取得
    public function getUsers()
    {
        $users = User::select('id', 'name', 'email', 'user_status', 'created_at')->get();

        return response()->json([
            'message' => 'ユーザー一覧取得成功',
            'users'   => $users
        ], 200);
    }

    // 【管理者用】特定ユーザー取得
    public function getUser($id)
    {
        $user = User::select('id', 'name', 'email', 'user_status')->find($id);

        if (!$user) {
            return response()->json([
                'message' => 'ユーザーが見つかりません'
            ], 404);
        }

        return response()->json([
            'message' => 'ユーザー取得成功',
            'user'    => $user
        ], 200);
    }

    // 【管理者用】ユーザー情報更新
    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'message' => 'ユーザーが見つかりません'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email,' . $id,
            'user_status' => 'required|in:0,1,2',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '入力エラーがあります',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user->update([
            'name'        => $request->name,
            'email'       => $request->email,
            'user_status' => $request->user_status,
        ]);

        return response()->json([
            'message' => 'ユーザー情報を更新しました',
            'user'    => $user
        ], 200);
    }
}

