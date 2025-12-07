<?php

namespace App\Http\Middleware;

use Closure;

class CorsMiddleware
{
    public function handle($request, Closure $next)
    {
        // プリフライトリクエスト（OPTIONS）の場合は即レスポンスを返す
        if ($request->getMethod() === "OPTIONS") {
            $response = response('', 200);
        } else {
            // 通常リクエストは次の処理へ
            $response = $next($request);
        }

        // 共通のCORSヘッダーを付与
        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:3000');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}