<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;


//laravelの基本コントローラーを継承
class UserController extends Controller
{
    //registerという名前の関数（新規登録処理）
    public function register(Request $request)
    {
        //バリデーション（入力チェック）を行う
        //$request->all()で送られてきた全データを取得
        //配列でルールを設定:name,email,passwordに対して条件を付ける
        $validator = Validator::make($request->all(),[
            'name' => 'required|string|max:255',
            //これで一意制約できた
            'email' => 'required|email|unique:users,email',
            'password' => ['required',
                          'string',
                          'min:12',
                          'regex:/[A-Z]/',       // 大文字
                          'regex:/[a-z]/',       // 小文字
                          'regex:/[0-9]/',       // 数字
                          'regex:/[!@&?]/',      // 記号
            ],
        ]);

        //バリデーションに失敗した場合の処理
        //エラー内容をJSON形式で返す（React側で表示できる）
        if($validator ->fails()){
            return response() ->json([
                'message' =>'入力エラーがあります',
                'errors' => $validator ->errors()
            ],422);//HTTPステータスコード:422(処理できない入力)
        }

        $user=User::create([
            'name'=>$request->name,
            'email'=>$request->email,
            'password'=>Hash::make($request->password),
            'user_status' => 1,           // 利用者として登録
           // 'is_delete' => 0,             // 未削除
            //'has_image_folder' => 0,      // 未作成

        ]);
    
        //バリデーションが成功した場合の処理（仮）
       //DB保存後に受け取ったnameとemailを返す
        return response() ->json([
            'message' => '登録処理は成功しました（仮）',
            'user'=>[
                'name'=>$user->name,
                'email'=>$user->email,
            ]
        ],201);//HTTPステータスコード:201(成功)
    }

    //ログイン
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'email' => 'required|email',
            'password'=>'required|string',
        ]);

        if($validator -> fails()){
            return response() ->json([
                'message'=>'入力エラーがあります',
                'errors'=>$validator->errors()
            ],422);        
        }
    


        //認証チェック
        if(Auth::attempt($request->only('email','password'))) {
            $user = Auth::user();

            //トークン作成(ランダム64文字)
          //  $token = bin2hex(random_bytes(32));

            /*
             // トークン保存
             Token::create([
                'user_id'     => $user->id,
                'token'       => $token,
                'expires_at'  => now()->addHour(1), // 有効期限1時間
                'last_used_at'=> now(),
            ]);
            */
            
            return response()->json([
                'message'=>'ログイン成功',
                'user'=>[
                    'id'=>$user->id,
                    'name'=>$user->name,
                    'email'=>$user->email,
                ]
            ],200);
        }else{
            return response()->json([
                'message'=>'メールアドレスまたはパスワードが違います'
            ],401);
        }
    }

}