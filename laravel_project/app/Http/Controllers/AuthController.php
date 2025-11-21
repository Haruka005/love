<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

//laravelの基本コントローラーを継承
class AuthController extends Controller
{
    
    /*新規会員登録*/
    
    public function register(Request $request)
    {
        //stangeのlaravlelogを開いて一番下に表示されている
        Log::info('登録リクエスト受信:', $request->all());

        //バリデーション（入力チェック）を行う
        //$request->all()で送られてきた全データを取得
        //配列でルールを設定:name,email,passwordに対して条件を付ける
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email', // ← 重複チェックも追加
            'password' => 'required|string|min:12',
        ]);

        //バリデーションに失敗した場合の処理
        //エラー内容をJSON形式で返す（React側で表示できる）
        if ($validator->fails()) {
            return response()->json([
                'message' => '入力エラーがあります',
                'errors'  => $validator->errors()
            ], 422); //HTTPステータスコード:422(処理できない入力)
        }

        //ユーザー作成
        $user = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'user_status'=> 1 //利用者として登録
        ]);

        //ログイン状態にすぐするためにトークン生成
        $token = bin2hex(random_bytes(32));

        //Tokenテーブルに保存（有効期限1時間）
        \App\Models\Token::create([
            'user_id'     => $user->id,
            'token'       => $token,
            'expires_at'  => now()->addHour(1),
            'last_used_at'=> now(),
        ]);

        //バリデーションが成功した場合の処理（仮）
        //DB保存はまだしないが、受け取ったnameとemailを返す → 実際には保存済み
        //React側でログイン状態にするためtokenとuserを返す
        return response()->json([
            'message' => '登録処理は成功しました',
            'token'   => $token,
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ]
        ], 201); //HTTPステータスコード:201(成功)
    }
} 