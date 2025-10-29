<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventImageController;
use App\Http\Controllers\UserController;





Route::get('/message', function () {
    return ['message' => 'こんにちは、React！'];
});

Route::middleware('auth:sanctum')->post('/upload-event-image', [EventImageController::class, 'uploadEventImage']);
//新規登録
Route::post('/register', [UserController::class, 'register']);
//ログイン
Route::post('/login', [UserController::class, 'login']);



