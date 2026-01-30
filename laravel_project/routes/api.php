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
use App\Models\User;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ReportController;

// 新しく作成したコントローラーをインポート
use App\Http\Controllers\AdminManagementController;

// --- 通報用ルート ---
Route::post('/report', [App\Http\Controllers\ReportController::class, 'sendReport']);

// ==============================
// 認証不要ルート
// ==============================
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::get('/users', [AdminController::class, 'user_all']);

// --- 管理者ログイン関連 ---
Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::post('/admin/verify-code', [AdminAuthController::class, 'verifyCode']); 

// ログアウト
Route::post('/logout', function (Request $request) {
    $bearerToken = $request->bearerToken();
    if ($bearerToken) {
        // Tokenモデルを使用してDBから物理削除
        \App\Models\Token::where('token', $bearerToken)->delete();
    }
    return response()->json(['message' => 'Logged out'], 200);
});

// アクセス記録エンドポイント
Route::post('/log-access', [AnalyticsController::class, 'storeAccess']);

Route::get('/events/{year}/{month}', [EventController::class, 'getByMonth']);
Route::get('/events/upcoming', [EventController::class, 'getUpComingEvent']);
Route::get('/events/{id}', [EventController::class, 'show']);

Route::get('/restaurants', [RestaurantController::class, 'getRestaurant']);
Route::get('/restaurants/{id}', [RestaurantController::class, 'show']);

Route::get('/m_areas', [RestaurantController::class, 'getAreas']);
Route::get('/m_budgets', [RestaurantController::class, 'getBudgets']);
Route::get('/m_genres', [RestaurantController::class, 'getGenres']);

// 住所検索API
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


// ==============================
// 認証必須ルート (Bearerトークン)
// ==============================
Route::middleware(['check.token'])->group(function () {
    Route::get('/me', [UserController::class, 'me']);
    Route::post('/store-restaurant-data', [RestaurantController::class, 'storeRestaurantData']);
    Route::post('/store-event-data', [EventController::class, 'storeEventData']);

    // --- 管理者専用：アカウント新規登録 ---
    Route::post('/admin/register', [AdminManagementController::class, 'store']);

    // --- 管理者イベントAPI ---
    Route::get('/admin/events/pending', [AdminEventController::class, 'getPendingEvents']);
    Route::get('/admin/events/approved', [AdminEventController::class, 'getApprovedEvents']);
    Route::get('/admin/events/{id}', [AdminEventController::class, 'show']);
    Route::put('/admin/events/{id}', [AdminEventController::class, 'update']);
    Route::post('/admin/events/{id}/status', [AdminEventController::class, 'updateEventStatus']);

    // --- 管理者飲食店API ---
    Route::get('/admin/restaurants/pending', [AdminRestaurantController::class, 'getPendingShops']);
    Route::get('/admin/restaurants/approved', [AdminRestaurantController::class, 'getApprovedShops']);
    Route::get('/admin/restaurants/{id}', [AdminRestaurantController::class, 'show']);
    Route::put('/admin/restaurants/{id}', [AdminRestaurantController::class, 'update']);
    Route::post('/admin/restaurants/{id}/status', [AdminRestaurantController::class, 'updateStatus']);

    // --- アクセス解析 ---
    Route::get('/admin/analytics-summary', [AnalyticsController::class, 'getSummary']);

    // --- ユーザー管理API ---
    Route::get('/admin/users', [AdminController::class, 'index']);
    Route::put('/admin/users/{id}', [AdminController::class, 'update']);
    // [修正] loginHistoryの重複行を1つに整理しました
    Route::get('/admin/users/{id}/history', [AdminController::class, 'loginHistory']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'destroy']);

    // --- 一般ユーザー用 ---
    Route::get('/events', [EventController::class, 'index']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);

    Route::get('/api_restaurants_history', [RestaurantController::class, 'index']);
    Route::put('/restaurants/{id}', [RestaurantController::class, 'update']);
    Route::delete('/restaurants/{id}', [RestaurantController::class, 'destroy']);
});

// ミドルウェア付きテストルート
Route::middleware(['web', 'check.token'])->get('/test-token', function () {
    return ['message' => 'Token OK'];
});


// ==============================
// メール認証ルート
// ==============================
Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'ユーザーが見つかりません。ID: '.$id], 404);
    }

    if (!$user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
    }

    // [修正] 戻り先をフロントエンド（React等）のログインURLに指定
    $loginUrl = "http://172.16.117.200"; 

    return <<<HTML
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>メール認証完了</title>
            <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7f6; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center; max-width: 400px; width: 90%; }
                .icon { font-size: 50px; color: #f93d5d; margin-bottom: 20px; }
                h1 { color: #333; font-size: 24px; margin-bottom: 10px; }
                p { color: #666; line-height: 1.6; margin-bottom: 30px; }
                .btn { background-color: #f93d5d; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; transition: opacity 0.2s; display: inline-block; }
                .btn:hover { opacity: 0.8; }
                .footer { margin-top: 30px; font-size: 12px; color: #aaa; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="icon">✓</div>
                <h1>認証が完了しました！</h1>
                <p>メールアドレスの確認が取れました。<br>これで全ての機能をご利用いただけます。</p>
                <a href="{$loginUrl}" class="btn">ログイン画面へ戻る</a>
                <div class="footer">このタブは閉じても大丈夫です</div>
            </div>
        </body>
        </html>
HTML;
})->name('verification.verify'); 
// 本番公開時はセキュリティのため末尾に ->middleware(['signed']) を追加してください


// パスワード再設定
Route::post('/forgot-password', [UserController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [UserController::class, 'resetPassword']);

// メールアドレス変更
Route::post('/email-change-request', [UserController::class, 'requestChange'])->middleware('check.token');
Route::get('/email-change/confirm', [UserController::class, 'confirmChange']);

// イベント・飲食店 メール認証
Route::get('/event-request/confirm', [EventController::class, 'confirmEvent']);
Route::get('/restaurant-request/confirm', [RestaurantController::class, 'confirmRestaurant']);