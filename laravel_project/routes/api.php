<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

use App\Models\User;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventDetailController;
use App\Http\Controllers\EventImageController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminEventController;
use App\Http\Controllers\AdminRestaurantController;
use App\Http\Controllers\AnalyticsController;

// ==============================
// 認証不要ルート
// ==============================

// ユーザーログイン/登録
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);

// 管理者ログイン
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// ユーザー一覧（管理者向けだが、保護なし）
Route::get('/users', [AdminController::class, 'user_all']);

// アクセス記録
Route::post('/log-access', [AnalyticsController::class, 'storeAccess']);

// イベント取得
Route::get('/events/{year}/{month}', [EventController::class, 'getByMonth']);
Route::get('/events/upcoming', [EventController::class, 'getUpComingEvent']);
Route::get('/events/{id}', [EventController::class, 'show']);

// 飲食店取得
Route::get('/restaurants', [RestaurantController::class, 'getRestaurant']);
Route::get('/restaurants/{id}', [RestaurantController::class, 'show']);

// マスタデータ
Route::get('/m_areas', [RestaurantController::class, 'getAreas']);
Route::get('/m_budgets', [RestaurantController::class, 'getBudgets']);
Route::get('/m_genres', [RestaurantController::class, 'getGenres']);

// ジオコーディング
Route::get('/geocode', function (Request $request) {
    $address = $request->query('q');
    if (!$address || strlen($address) < 3) {
        return response()->json(['error' => '住所が不正です'], 400);
    }
    $response = Http::withOptions([
        'verify' => false,
        'headers' => ['User-Agent' => 'NoboribetsuMapApp/1.0 (love@example.com)']
    ])->get('https://nominatim.openstreetmap.org/search', [
        'format' => 'json',
        'q' => $address,
        'limit' => 1,
    ]);
    return response()->json($response->json() ?: []);
});

// イベントデータ保存
Route::post('/store-event-data', [EventImageController::class, 'storeEventData']);

// バージョン付きルート
Route::prefix('v1')->group(function () {
    Route::post('/store-event-detail', [EventDetailController::class, 'store']);
});

// ==============================
// 認証必須ルート（Sanctum）
// ==============================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', fn(Request $request) => response()->json($request->user()));
    Route::post('/upload-event-image', [EventImageController::class, 'uploadEventImage']);
    Route::post('/store-restaurant-data', [RestaurantController::class, 'storeRestaurantData']);

    // ユーザー管理
    Route::get('/users', [UserController::class, 'getUsers']);
    Route::get('/users/{id}', [UserController::class, 'getUser']);
    Route::put('/users/{id}', [UserController::class, 'updateUser']);
});

// ==============================
// 認証必須ルート（Bearerトークン）
// ==============================
Route::middleware(['check.token'])->group(function () {
    Route::get('/me', [UserController::class, 'me']);
    Route::post('/store-restaurant-data', [RestaurantController::class, 'storeRestaurantData']);
    Route::post('/store-event-data', [EventController::class, 'storeEventData']);

    Route::post('/logout', function (Request $request) {
        if ($request->user()) {
            $request->user()->tokens()->delete();
        }
        return response()->json(['message' => 'Logged out'], 200);
    });

    // 管理者イベントAPI
    Route::get('/admin/events/pending', [AdminEventController::class, 'getPendingEvents']);
    Route::get('/admin/events/approved', [AdminEventController::class, 'getApprovedEvents']);
    Route::get('/admin/events/{id}', [AdminEventController::class, 'show']);
    Route::put('/admin/events/{id}', [AdminEventController::class, 'update']);
    Route::post('/admin/events/{id}/status', [AdminEventController::class, 'updateEventStatus']);

    // 管理者飲食店API
    Route::get('/admin/restaurants/pending', [AdminRestaurantController::class, 'getPendingShops']);
    Route::get('/admin/restaurants/approved', [AdminRestaurantController::class, 'getApprovedShops']);
    Route::get('/admin/restaurants/{id}', [AdminRestaurantController::class, 'show']);
    Route::put('/admin/restaurants/{id}', [AdminRestaurantController::class, 'update']);
    Route::post('/admin/restaurants/{id}/status', [AdminRestaurantController::class, 'updateStatus']);

    // アクセス解析
    Route::get('/admin/analytics-summary', [AnalyticsController::class, 'getSummary']);

    // ユーザー用イベント・飲食店
    Route::get('/events', [EventController::class, 'index']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);

    Route::get('/api_restaurants_history', [RestaurantController::class, 'index']);
    Route::put('/restaurants/{id}', [RestaurantController::class, 'update']);
    Route::delete('/restaurants/{id}', [RestaurantController::class, 'destroy']);
});

// ==============================
// テスト・その他
// ==============================

Route::middleware(['web', 'check.token'])->get('/test-token', function () {
    return ['message' => 'Token OK'];
});

// メール認証
Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    $user = User::findOrFail($id);

    if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['message' => '無効な認証リンクです'], 403);
    }

    if ($user->hasVerifiedEmail()) {
        return response()->json(['message' => 'すでに認証済みです']);
    }

    $user->markEmailAsVerified();
    return "メール認証に成功しました！このタブを閉じてログインしてください。";
})->name('verification.verify')->middleware(['signed']);

// パスワード再設定
Route::post('/forgot-password', [UserController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [UserController::class, 'resetPassword']);

// メールアドレス変更
Route::post('/email-change-request', [UserController::class, 'requestChange'])->middleware('check.token');
Route::get('/email-change/confirm', [UserController::class, 'confirmChange']);

// イベントメール認証
Route::get('/event-request/confirm', [EventController::class, 'confirmEvent']);

// 飲食店メール認証
Route::get('/restaurant-request/confirm', [RestaurantController::class, 'confirmRestaurant']);
