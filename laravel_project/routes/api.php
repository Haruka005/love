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
//use App\Models\Token;

// 認証不要ルート


//イベントを月ごとに取得
Route::get('/events/{year}/{month}', [EventController::class, 'getByMonth']); 

//今月のイベント取得
Route::get('/events/upcoming',[EventController::class, 'getUpComingEvent']);

//イベント詳細取得
Route::get('/events/{id}',[EventController::class,'show']);

//飲食店取得
Route::get('/restaurants',[RestaurantController::class, 'getRestaurant']);

//飲食店詳細取得
Route::get('/restaurants/{id}',[RestaurantController::class, 'show']);

//
Route::middleware('auth:sanctum')->post('/upload-event-image', [EventImageController::class, 'uploadEventImage']);

//新規登録
Route::post('/register', [UserController::class, 'register']);

//ログイン
Route::post('/login', [UserController::class, 'login']);

//店登録のマップに使ってる
Route::get('/geocode', function (Request $request) {
    $address = $request->query('q');
    if (!$address || strlen($address) < 3) {
        return response()->json(['error' => '住所が不正です'], 400);
    }

    $response = Http::withOptions(['verify' => false])->get('https://nominatim.openstreetmap.org/search', [
        'format' => 'json',
        'q' => $address,
        'limit' => 1,
    ]);

    $data = $response->json();

    if (empty($data)) {
        return response()->json([], 200); // ← 空でも明示的に返す
    }

    return response()->json($data);
});

Route::get('/events/{year}/{month}', [EventController::class, 'getByMonth']);
Route::get('/events/upcoming', [EventController::class, 'getUpComingEvent']);
Route::post('/store-event-data', [EventImageController::class, 'storeEventData']);

Route::post('/store-restaurant-data', [RestaurantController::class, 'storeRestaurantData']);
Route::get('/m_areas', [RestaurantController::class, 'getAreas']);
Route::get('/m_budgets', [RestaurantController::class, 'getBudgets']);
Route::get('/m_genres', [RestaurantController::class, 'getGenres']);
Route::get('/restaurants', [RestaurantController::class, 'getRestaurant']);


// 認証必須ルート
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', fn(Request $request) => response()->json($request->user()));
    Route::post('/upload-event-image', [EventImageController::class, 'uploadEventImage']);
    Route::post('/store-restaurant-data', [RestaurantController::class, 'storeRestaurantData']);
});

// バージョン付きルート（例：v1）
Route::prefix('v1')->group(function () {
    Route::post('/store-event-detail', [EventDetailController::class, 'store']);
});