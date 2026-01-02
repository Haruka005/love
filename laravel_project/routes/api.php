<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminEventController;
use App\Http\Controllers\AdminRestaurantController;
use App\Http\Controllers\EventDetailController;
use App\Models\User;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AnalyticsController;

// ==============================
// 認証不要ルート
// ==============================

Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::get('/users', [AdminController::class, 'user_all']); 
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// 追加：アクセス記録用エンドポイント（誰でもアクセス可能）
Route::post('/log-access', [AnalyticsController::class, 'storeAccess']);


Route::get('/events/{year}/{month}', [EventController::class, 'getByMonth']);
Route::get('/events/upcoming', [EventController::class, 'getUpComingEvent']);
Route::get('/events/{id}', [EventController::class, 'show']);

Route::get('/restaurants', [RestaurantController::class, 'getRestaurant']);
Route::get('/restaurants/{id}', [RestaurantController::class, 'show']);

Route::get('/m_areas', [RestaurantController::class, 'getAreas']);
Route::get('/m_budgets', [RestaurantController::class, 'getBudgets']);
Route::get('/m_genres', [RestaurantController::class, 'getGenres']);

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

/// ==============================
// 認証必須ルート (Bearerトークン)
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

    // --- 管理者イベントAPI ---
    Route::get('/admin/events/pending', [AdminEventController::class, 'getPendingEvents']); 
    Route::get('/admin/events/approved', [AdminEventController::class, 'getApprovedEvents']);
    Route::get('/admin/events/{id}', [AdminEventController::class, 'show']);
    Route::put('/admin/events/{id}', [AdminEventController::class, 'update']);
    Route::post('/admin/events/{id}/status', [AdminEventController::class, 'updateEventStatus']);
    Route::get('/admin/events/approved', [AdminEventController::class, 'getApprovedEvents']);

    // --- 管理者飲食店API ---
    Route::get('/admin/restaurants/pending', [AdminRestaurantController::class, 'getPendingShops']);
    Route::get('/admin/restaurants/approved', [AdminRestaurantController::class, 'getApprovedShops']);
    Route::get('/admin/restaurants/{id}', [AdminRestaurantController::class, 'show']);
    
    Route::put('/admin/restaurants/{id}', [AdminRestaurantController::class, 'update']);
    Route::post('/admin/restaurants/{id}/status', [AdminRestaurantController::class, 'updateStatus']);

    // 追加：管理者用アクセス解析サマリーAPI
    Route::get('/admin/analytics-summary', [AnalyticsController::class, 'getSummary']);

    // --- 一般ユーザー用 ---
    Route::get('/events', [EventController::class, 'index']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']); 

    Route::get('/api_restaurants_history', [RestaurantController::class, 'index']);
    Route::put('/restaurants/{id}', [RestaurantController::class, 'update']);
    Route::delete('/restaurants/{id}', [RestaurantController::class, 'destroy']);
});

Route::prefix('v1')->group(function () {
    Route::post('/store-event-detail', [EventDetailController::class, 'store']);
});

Route::middleware(['web', 'check.token'])->get('/test-token', function () {
    return ['message' => 'Token OK'];
});

//メール認証ルート
Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    //ユーザーをIDで探す
    $user = User::findOrFail($id);

    //URLのハッシュが正しいかチェック
    if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['message' => '無効な認証リンクです'], 403);
    }

    //すでに認証済みなら
    if ($user->hasVerifiedEmail()) {
        return response()->json(['message' => 'すでに認証済みです']);
    }

    //認証完了処理（email_verified_at に現在時刻を保存）
    $user->markEmailAsVerified();

    //最後にReact側（フロント）の完了ページへリダイレクト
    //まだ画面がない場合は、とりあえずメッセージを返す
    return "メール認証に成功しました！このタブを閉じてログインしてください。";
    
})->name('verification.verify')->middleware(['signed']);


//パスワード再設定
//申請
Route::post('/forgot-password', [UserController::class, 'sendResetLinkEmail']);
//確定
Route::post('/reset-password', [UserController::class, 'resetPassword']);

//メールアドレス変更
//申請
Route::post('/email-change-request', [UserController::class, 'requestChange'])->middleware('check.token');
//確定
Route::get('/email-change/confirm', [UserController::class, 'confirmChange']);

//イベントメール認証
Route::get('/event-request/confirm', [EventController::class, 'confirmEvent']);

//飲食店メール認証
Route::get('/restaurant-request/confirm', [RestaurantController::class, 'confirmRestaurant']);
