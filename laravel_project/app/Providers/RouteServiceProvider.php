<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use App\Http\Middleware\CheckToken;
use App\Http\Middleware\CorsMiddleware;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // 名前付きルートミドルウェアの登録
        Route::aliasMiddleware('check.token', CheckToken::class);
        Route::aliasMiddleware('cors', CorsMiddleware::class);

        $this->routes(function () {
           // Route::middleware('api')
                Route::prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }
}