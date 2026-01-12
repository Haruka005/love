<?php
//飲食店登録・管理機能
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Restaurant;
use App\Models\Genre;
use App\Models\Area;
use App\Models\Budget;
use App\Mail\RestaurantReappliedMail;

class RestaurantController extends Controller
{
    /**
     * ログインユーザーの登録店舗一覧 (マイページ用)
     */
    public function index(Request $request)
    {
        try {
            $userId = $request->user()->id;
            
            $restaurants = Restaurant::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($restaurants);
        } catch (\Exception $e) {
            return response()->json(['error' => '店舗一覧の取得に失敗しました'], 500);
        }
    }

    /**
     * 新規店舗登録処理
     */
    public function storeRestaurantData(Request $request)
    {
        // イベント側と同じく input() を使用して安全にユーザーを取得
        $userId = $request->input('user_id');
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['error' => 'ユーザーが見つかりません'], 404);
        }

        Log::info('店舗登録申請開始', ['user_id' => $user->id]);

        // バリデーション
        $request->validate([
            'topimages.*' => 'required|image|max:5120',
            'images.*' => 'nullable|image|max:5120',
            'name' => 'required|string|max:255',
            'catchphrase' => 'required|string|max:255',
            'tel' => 'required|string',
            'address' => 'required|string',
            'area_id' => 'required|integer',
            'genre_id' => 'required|integer',
            'budget_id' => 'required|integer',
            'business_hours' => 'required|string',
            'holiday' => 'required|string',
        ]);

        try {
            $restaurant = new Restaurant();

            $restaurant->user_id = $user->id;
            $restaurant->name = $request->input('name');
            $restaurant->catchphrase = $request->input('catchphrase');
            $restaurant->tel = $request->input('tel');
            $restaurant->address = $request->input('address');
            $restaurant->url = $request->input('url');
            $restaurant->comment = $request->input('comment');
            $restaurant->business_hours = $request->input('business_hours');
            $restaurant->holiday = $request->input('holiday');
            $restaurant->genre_id = (int)$request->input('genre_id');
            $restaurant->area_id = (int)$request->input('area_id');
            $restaurant->budget_id = (int)$request->input('budget_id');

            // 初期ステータス：メール認証待ち(0)
            $restaurant->approval_status_id = 0;
            $restaurant->confirmation_token = Str::random(64);
            $restaurant->latitude = $request->input('latitude') ?: 42.4123;
            $restaurant->longitude = $request->input('longitude') ?: 141.2063;

            $basePath = "user_images/{$user->id}/restaurants";

            // メイン画像の保存
            if ($request->hasFile('topimages')) {
                $topFile = $request->file('topimages')[0];
                $path = $topFile->store($basePath . "/top", 'public');
                $restaurant->topimage_path = Storage::url($path);
            }

            // サブ画像の保存 (最大3枚)
            if ($request->hasFile('images')) {
                $subImages = $request->file('images');
                foreach ($subImages as $index => $image) {
                    if ($index < 3 && $image) {
                        $path = $image->store($basePath . "/detail", 'public');
                        $col = "image" . ($index + 1) . "_path";
                        $restaurant->$col = Storage::url($path);
                    }
                }
            }

            $restaurant->save();

            // 認証リンクの生成とメール送信
            $confirmationUrl = url("/api/restaurant-request/confirm?token=" . $restaurant->confirmation_token);
            Mail::to($user->email)->send(new RestaurantReappliedMail($restaurant->name, $confirmationUrl));

            return response()->json(['message' => '店舗情報を保存しました。メールを確認してください。'], 201);

        } catch (\Exception $e) {
            Log::error('店舗登録エラー: ' . $e->getMessage());
            return response()->json(['error' => 'サーバーエラーが発生しました'], 500);
        }
    }

    /**
     * 店舗情報の更新 (一般ユーザー用：再申請)
     */
    public function update(Request $request, $id)
    {
        try {
            $restaurant = Restaurant::findOrFail($id);

            // 権限チェック
            if ($restaurant->user_id !== $request->user()->id && !$request->user()->is_admin) {
                return response()->json(['error' => '編集権限がありません'], 403);
            }

            // フィールド更新
            $fields = ['name', 'catchphrase', 'tel', 'address', 'url', 'comment', 'business_hours', 'holiday', 'genre_id', 'area_id', 'budget_id'];
            foreach ($fields as $field) {
                if ($request->has($field)) {
                    $val = $request->input($field);
                    $restaurant->$field = in_array($field, ['genre_id', 'area_id', 'budget_id']) ? (int)$val : $val;
                }
            }

            $needsEmail = false;

            if ($request->input('from_admin') === "true") {
                // 管理者からの編集時
                $restaurant->approval_status_id = (int)$request->input('approval_status_id');
            } else {
                // ユーザーからの編集時：再申請扱い
                $restaurant->approval_status_id = 0; // メール認証待ちに戻す
                $restaurant->confirmation_token = Str::random(64);
                $restaurant->rejection_reason = null; 
                $needsEmail = true;
            }

            // 画像の差し替え
            $basePath = "user_images/{$restaurant->user_id}/restaurants";
            if ($request->hasFile('topimage')) {
                $path = $request->file('topimage')->store($basePath, 'public');
                $restaurant->topimage_path = Storage::url($path);
            }
            for ($i = 1; $i <= 3; $i++) {
                if ($request->hasFile("image{$i}")) {
                    $path = $request->file("image{$i}")->store($basePath, 'public');
                    $col = "image{$i}_path";
                    $restaurant->$col = Storage::url($path);
                }
            }

            $restaurant->save();

            // 再申請の場合、確認メールを再送
            if ($needsEmail) {
                $user = $request->user();
                $confirmationUrl = url("/api/restaurant-request/confirm?token=" . $restaurant->confirmation_token);
                Mail::to($user->email)->send(new RestaurantReappliedMail($restaurant->name, $confirmationUrl));
            }

            return response()->json(['message' => '店舗情報を更新しました', 'restaurant' => $restaurant]);

        } catch (\Exception $e) {
            Log::error("店舗更新失敗: " . $e->getMessage());
            return response()->json(['error' => '店舗更新に失敗しました'], 500);
        }
    }

    /**
     * メール認証完了処理 (飲食店専用の成功ページへリダイレクト)
     */
    public function confirmRestaurant(Request $request)
    {
        $token = $request->query('token');
        $restaurant = Restaurant::where('confirmation_token', $token)->first();

        // トークンが無効な場合
        if (!$restaurant) {
            return redirect('http://localhost:3000/event-registration-error');
        }

        // ステータスを管理者審査待ち(1)へ更新
        $restaurant->approval_status_id = 1;
        $restaurant->confirmation_token = null;
        $restaurant->save();

        // ★ 飲食店専用の成功ページ（RestaurantRegistrationSuccess.jsx）へリダイレクト
        return redirect('http://localhost:3000/restaurant-registration-success');
    }

    /**
     * 店舗削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $restaurant = Restaurant::findOrFail($id);
            if ($restaurant->user_id !== $request->user()->id && !$request->user()->is_admin) {
                return response()->json(['error' => '権限がありません'], 403);
            }
            $restaurant->delete();
            return response()->json(['message' => '店舗情報を削除しました']);
        } catch (\Exception $e) {
            return response()->json(['error' => '店舗削除に失敗しました'], 500);
        }
    }

    /**
     * 公開詳細用
     */
    public function show($id)
    {
        try {
            $restaurant = Restaurant::with(['genre', 'area', 'budget'])->findOrFail($id);
            $images = array_filter([
                $restaurant->topimage_path,
                $restaurant->image1_path,
                $restaurant->image2_path,
                $restaurant->image3_path
            ]);
            $restaurant->all_images = array_values($images); 
            return response()->json($restaurant);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Not found'], 404);
        }
    }

    /**
     * 公開中店舗一覧取得
     */
    public function getRestaurant()
    {
        try {
            $restaurants = Restaurant::with(['genre', 'area', 'budget'])
                ->where('approval_status_id', 2) 
                ->get();
            return response()->json($restaurants);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // マスタデータ取得用
    public function getGenres() { return response()->json(Genre::all()); }
    public function getAreas() { return response()->json(Area::all()); }
    public function getBudgets() { return response()->json(Budget::all()); }
}

