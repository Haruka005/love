<?php
//CheckToken.phpAPI通信時のトークン認証共通処理


namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Token;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth; 


class CheckToken
{
    public function handle(Request $request, Closure $next)
    {
        //確認用
        Log::info('ミドルウェア開始');

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

        //確認用ログ
        \Log::info('Tokenから取得したユーザー', ['user' => $record?->user]);


        //不正なトークンの場合→エラー
        if (!$record) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        //有効期限切れの場合
        if ($record->token_expires_at->isPast()) {
            Log::warning('【CheckToken】トークン期限切れ', ['token' => $token, 'expires_at' => $record->token_expires_at]);
            // 期限切れの場合、データベースからも削除します
            return response()->json(['error' => 'Token expired'], 401);
        }

        //最終使用日時を更新
        $record->update(['last_used_at' => now()]);

        // ユーザーをリクエストとAuthにセット
        $user = $record->user;
        $request->setUserResolver(fn () => $user);
        Auth::setUser($user); 

        
        //確認用ログ
        Log::info('セッション情報確認', [
            'session_id' => session()->getId(),       // セッションID
            'all' => session()->all(),                // セッション内すべてのデータ
            'user_id' => $request->user()?->id ?? null,  // 認証ユーザーID
        ]);

        //すべてクリアの場合次の処理
        return $next($request);
    }
    
}
