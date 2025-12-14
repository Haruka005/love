<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // --- main側で追加されていた内容（参考用） ---
        // $allowedOrigin = '*';   // ← mainではワイルドカードで全てのオリジンを許可

        // --- local側で有効な設定 ---
         $allowedOrigins = [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://172.16.117.200:3000',
        ];

        $origin = $request->headers->get('Origin');

        $allowCredentials = 'true'; // 認証情報を伴うリクエストを許可
        $allowedMethods = 'GET, POST, PUT, DELETE, OPTIONS'; // 許可するHTTPメソッド
        $allowedHeaders = 'Content-Type, X-Auth-Token, Origin, Authorization'; // 許可するヘッダー

        // ログ
        Log::debug('CorsMiddleware 実行開始');  

        // プリフライトリクエスト（OPTIONS）の場合は即レスポンスを返す
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 204); // 204 No Content がプリフライトの標準レスポンス

            $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
            $response->headers->set('Access-Control-Allow-Methods', $allowedMethods);
            $response->headers->set('Access-Control-Allow-Headers', $allowedHeaders);
            $response->headers->set('Access-Control-Allow-Credentials', $allowCredentials);
            $response->headers->set('Access-Control-Max-Age', '86400'); // プリフライト結果をキャッシュする時間(秒)

            return $response;
        }

        // 通常リクエストの処理
        $response = $next($request);

        // レスポンスにCORSヘッダーを付与
        $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
        $response->headers->set('Access-Control-Allow-Methods', $allowedMethods);
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}