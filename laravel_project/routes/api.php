<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventImageController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EventDetailController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminAuthController;

// 管理者ログイン
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// 認証不要ルート
Route::get('/events/{year}/{month}', [EventController::class, 'getByMonth']); 
Route::get('/events/upcoming', [EventController::class, 'getUpComingEvent']);
Route::get('/events/{id}', [EventController::class, 'show']);
Route::get('/restaurants', [RestaurantController::class, 'getRestaurant']);
Route::get('/restaurants/{id}', [RestaurantController::class, 'show']);
Route::post('/upload-event-image', [EventImageController::class, 'uploadEventImage']);

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

// ジオコーディングAPI
Route::get('/geocode', function (Request $request) {
    $address = $request->query('q');
    if (!$address || strlen($address) < 3) {
        return response()->json(['error' => '住所が不正です'], 400);
    }
    $response = Http::withOptions(['verify' => false])->get('https://nominatim.openstreetmap.org/search', [
        'format' => 'json',
        'q' => $address,
    ]);
    return $response->json();
});

// イベントデータ保存
Route::post('/store-event-data', [EventImageController::class, 'storeEventData']);

// バージョン付きルート（例：v1）
Route::prefix('v1')->group(function () {
    Route::post('/store-event-detail', [EventDetailController::class, 'store']);
});

// 認証必須ルート
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', fn(Request $request) => response()->json($request->user()));
    Route::post('/upload-event-image', [EventImageController::class, 'uploadEventImage']);
    Route::post('/store-restaurant-data', [RestaurantController::class, 'storeRestaurantData']);

    // --- ユーザー管理API（管理者用） ---
    Route::get('/users', [UserController::class, 'getUsers']);          // ユーザー一覧取得
    Route::get('/users/{id}', [UserController::class, 'getUser']);      // 特定ユーザー取得
    Route::put('/users/{id}', [UserController::class, 'updateUser']);   // ユーザー情報更新
});
