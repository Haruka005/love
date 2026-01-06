<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

use App\Http\Middleware\CheckToken;
use App\Http\Middleware\CorsMiddleware;
use Illuminate\Session\Middleware\StartSession;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // CorsMiddleware をグローバルに適用（最上位に）
        $middleware->prepend(CorsMiddleware::class);
        $middleware->append(StartSession::class);
        $middleware->alias(['check.token' => CheckToken::class]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->create();