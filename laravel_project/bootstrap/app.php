<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

use App\Http\Middleware\CheckToken;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function ($middleware): void {
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
        //自作ミドルウェア
        $middleware->prepend(\App\Http\Middleware\CheckToken::class);
    })
    ->withExceptions(function ($exceptions): void {
        //
    })->create();

