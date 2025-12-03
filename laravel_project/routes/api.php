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

//ログイン
Route::post('/login', [UserController::class, 'login']);

//ユーザー一覧取得
Route::get('/users', [AdminController::class, 'user_all']); 

// イベント取得
Route::get('/events/{year}/{month}', [EventController::class, 'getByMonth']);
Route::get('/events/upcoming', [EventController::class, 'getUpComingEvent']);
Route::get('/events/{id}', [EventController::class, 'show']);

// 飲食店取得
Route::get('/restaurants', [RestaurantController::class, 'getRestaurant']);
Route::get('/restaurants/{id}', [RestaurantController::class, 'show']);

// 店舗登録（認証不要で受け付ける）
Route::post('/store-restaurant-data', [RestaurantController::class, 'storeRestaurantData']);

//イベント登録（認証不要で受けつける）
Route::post('/store-event-data', [EventImageController::class, 'storeEventData']);

//イベント登録編集
Route::get('/events', [EventController::class, 'index']);
Route::put('/events/{id}', [EventController::class, 'update']);


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
    Route::get('/me', [UserController::class, 'me']); 

    //ログアウト
    Route::post('/logout', function (Request $request) {
         \Log::info('ログアウト処理開始', ['user' => $request->user()]);

        // 認証トークン削除
        if ($request->user()) {
            $request->user()->tokens()->delete();
        }

        \Log::info('トークン削除完了');

        return response()->json(['message' => 'Logged out'], 200)
            ->cookie('token', '', -1);//クッキー削除
    });

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