<?php

// use消さない！（ルートで使うクラスを探すためのもの）
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\EventController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminEventController;
use App\Http\Controllers\EventDetailController;
use App\Http\Controllers\UserController;

// ==============================
// 認証不要ルート
// ==============================

// ログイン
Route::post('/login', [UserController::class, 'login']);

// 新規登録
Route::post('/register', [AuthController::class, 'register']);

// ユーザー一覧取得
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

// イベント登録（認証不要で受け付ける）
Route::post('/store-event-data', [EventController::class, 'storeEventData']);


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
    return response()->json($data ?: []);
});

/// ==============================
// 認証必須ルート (Bearerトークン)
// ==============================
Route::middleware(['check.token'])->group(function () {

    // ログインユーザー情報
    Route::get('/me', [UserController::class, 'me']); 

    // ログアウト
    Route::post('/logout', function (Request $request) {
        \Log::info('ログアウト処理開始', ['user' => $request->user()]);

        if ($request->user()) {
            $request->user()->tokens()->delete();
        }

        \Log::info('トークン削除完了');

        return response()->json(['message' => 'Logged out'], 200);
    });

    // 管理者イベントAPI
    Route::get('/admin/events/pending', [AdminEventController::class, 'getPendingEvents']); 
    Route::post('/admin/events/{id}/status', [AdminEventController::class, 'updateEventStatus']);
    Route::get('/admin/events/approved', [AdminEventController::class, 'getApprovedEvents']);

    // ユーザー自身のイベント登録履歴
    Route::get('/events', [EventController::class, 'index']);

    // イベント編集・削除
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']); // destroyメソッド要実装
});


// ==============================
// バージョン付きルート
// ==============================
Route::prefix('v1')->group(function () {
    Route::post('/store-event-detail', [EventDetailController::class, 'store']);
});

// ==============================
// テストルート
// ==============================
Route::middleware(['web', 'check.token'])->get('/test-token', function () {
    return ['message' => 'Token OK'];
});

