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
        //許可する設定
        $allowedOrigin = 'http://localhost:3000';
        $allowCredentials = 'true'; //認証情報を伴うリクエストを許可
        $allowedMethods = 'GET, POST, PUT, DELETE, OPTIONS'; //許可するHTTPメソッド
        $allowedHeaders = 'Content-Type, X-Auth-Token, Origin, Authorization'; //許可するヘッダー

        //ログ
        Log::debug('CorsMiddleware 実行開始'); 

        // プリフライトリクエスト（OPTIONS）の場合は即レスポンスを返す
        if ($request->isMethod('OPTIONS')) {
            // OPTIONSリクエストの場合、空のレスポンスを返す前にCORSヘッダーを設定
            $response = response('', 204); // 204 No Content がプリフライトの標準レスポンス

            $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
            $response->headers->set('Access-Control-Allow-Methods', $allowedMethods);
            $response->headers->set('Access-Control-Allow-Headers', $allowedHeaders);
            $response->headers->set('Access-Control-Allow-Credentials', $allowCredentials);
            
            // プリフライト結果をキャッシュする時間(秒)
            $response->headers->set('Access-Control-Max-Age', '86400'); 
            
            return $response;
        }

        // 通常リクエストの処理
        $response = $next($request);
        // レスポンスにCORSヘッダーを付与
        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:3000');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}