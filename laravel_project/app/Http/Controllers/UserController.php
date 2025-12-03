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

        if(!$user){
            return response()->json(['message'=>'メールアドレスまたはパスワードが違います'],401);
        }

        //ロックチェック
        if($user->is_locked){
            $lockDuration = 5; // 5分ロック
            //ロック開始時間＋5分が未来かどうか
            if($user->locked_at && $user->locked_at->addMinutes($lockDuration)->isFuture()){
                //yesだったらまだロック中
                return response()->json(['message'=>'アカウントがロック中です'],403);
            }else{
                //noなら自動解除
                $user->is_locked = false; //ロック解除
                $user->login_attempts = 0; //失敗回数リセット
                $user->locked_at = null; //ロック開始日リセット
                $user->save(); //データベースに反映
            }
        }

        //認証チェック
        if(Hash::check($request->password, $user->password)) {

            //トークン作成(ランダム64文字)
           $token = bin2hex(random_bytes(32));
            //確認用ログ
           \Log::info('ログイン成功、トークン発行', ['user_id' => $user->id, 'token' => $token]);

            
             // トークン保存
             Token::create([
                'user_id'     => $user->id,
                'token'       => $token,
                'token_expires_at' => now()->addHour(1),  // 有効期限1時間
                'last_used_at'=> now(),
            ]);

            //確認用ログ
            \Log::info('トークン保存完了', ['token' => $token]);
            
            
            return response()->json([
                'message'=>'ログイン成功',
                'token'   => $token,
                'user'=>[
                    'id'=>$user->id,
                    'name'=>$user->name,
                    'email'=>$user->email,
                ]
            ],200);
        }else{
           // ログイン失敗 → 失敗回数カウント
            $user->login_attempts += 1;

            //失敗回数が5回以上か
            if($user->login_attempts >= 5){
                $user->is_locked = true; //アカウントをロック状態に
                $user->locked_at = now(); //ロックした日付を記録
            }

            $user->save(); //データベースに反映

            //ロック中→ロックのメッセージ　それ以外→違うよメッセージ
            $msg = $user->is_locked 
                ? 'アカウントロックしました' 
                : 'メールアドレスまたはパスワードが違います';

            return response()->json(['message'=>$msg],401);
        }
    }

}