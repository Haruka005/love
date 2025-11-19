<?php

//use消さない！（ルートで使うクラスを探すためのもの）
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventImageController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EventDetailController;
use App\Http\Controllers\UserController;

// 認証不要ルート

// イベント取得
Route::get('/events/{year}/{month}', [EventController::class, 'getByMonth']);
Route::get('/events/upcoming', [EventController::class, 'getUpComingEvent']);
Route::get('/events/{id}', [EventController::class, 'show']);

// 飲食店取得
Route::get('/restaurants', [RestaurantController::class, 'getRestaurant']);
Route::get('/restaurants/{id}', [RestaurantController::class, 'show']);

// ユーザー登録・ログイン
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

// 店舗登録（認証不要で受け付ける）
Route::post('/store-restaurant-data', [RestaurantController::class, 'storeRestaurantData']);

//イベント登録（認証不要で受けつける）
Route::post('/store-event-data', [EventImageController::class, 'storeEventData']);

// マスターデータ取得（ラジオボタン用）
Route::get('/m_areas', [RestaurantController::class, 'getAreas']);
Route::get('/m_budgets', [RestaurantController::class, 'getBudgets']);
Route::get('/m_genres', [RestaurantController::class, 'getGenres']);

// ジオコーディングAPI
Route::get('/geocode', function (Request $request) {
    $address = $request->query('q');
    if (!$address || strlen($address) < 3) {
        return response()->json(['error' => '住所が不正です'], 400);
    }

    $response = Http::withOptions([
        'verify' => false,
        'headers' => [
            'User-Agent' => 'NoboribetsuMapApp/1.0 (love@example.com)'
        ]
    ])->get('https://nominatim.openstreetmap.org/search', [
        'format' => 'json',
        'q' => $address,
        'limit' => 1,
    ]);

    $data = $response->json();

    if (empty($data)) {
        return response()->json([], 200);
    }

    return response()->json($data);
});

// 認証必須ルート
Route::middleware('check.token')->group(function () {
    Route::get('/me', fn(Request $request) => response()->json($request->user()));
    Route::post('/upload-event-image', [EventImageController::class, 'uploadEventImage']);
});

// バージョン付きルート（例：v1）
Route::prefix('v1')->group(function () {
    Route::post('/store-event-detail', [EventDetailController::class, 'store']);
});

//テストルート
Route::middleware('check.token')->get('/test-token', function () {
    return ['message' => 'Token OK'];
});
