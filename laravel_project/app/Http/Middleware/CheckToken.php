<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Token;

class CheckToken
{
    public function handle(Request $request, Closure $next)
    {
        //OPTIONS(送っていい？って聞くリクエスト)を通過させる
        if ($request->getMethod() === 'OPTIONS') {
            return response()->json([], 200);
        }

        //Authorizationヘッダーを取得（HTTPリクエストのヘッダー内の送信者の情報）
        $header = $request->header('Authorization');

        //トークンがない、形式が違う場合エラー
        if (!$header || !preg_match('/Bearer\s+(.+)/', $header, $matches)) {
            return response()->json(['error' => 'Token required'], 401);
        }

        //トークンを取り出す
        $token = $matches[1];

        //DBを確認、ない場合は不正なトークン
        $record = Token::where('token', $token)->first();

        //不正なトークンの場合→エラー
        if (!$record) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        //有効期限切れの場合
        if ($record->expired_flg) {
            return response()->json(['error' => 'Token expired'], 401);
        }

        //すべてクリアの場合次の処理
        return $next($request);
    }
    
}
