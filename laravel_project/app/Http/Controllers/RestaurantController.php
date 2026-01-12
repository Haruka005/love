<?php

//飲食店登録機能
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
use App\Mail\RestaurantApplicationMail;

class RestaurantController extends Controller
{
    // --- ログインユーザーの登録店舗一覧 ---
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

    // --- 店舗登録処理 ---
    public function storeRestaurantData(Request $request)
    {
        Log::info('店舗登録申請開始', ['user_id' => $request->input('user_id')]);

        //バリデーション
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
            $user = User::findOrFail($request->user_id);
            $restaurant = new Restaurant();

            //基本情報のセット
            $restaurant->user_id = $user->id;
            $restaurant->name = $request->name;
            $restaurant->catchphrase = $request->catchphrase;
            $restaurant->tel = $request->tel;
            $restaurant->address = $request->address;
            $restaurant->url = $request->url;
            $restaurant->comment = $request->comment;
            $restaurant->business_hours = $request->business_hours;
            $restaurant->holiday = $request->holiday;
            $restaurant->genre_id = (int)$request->genre_id;
            $restaurant->area_id = (int)$request->area_id;
            $restaurant->budget_id = (int)$request->budget_id;

            //ステータス0（認証待ち）とトークン発行
            $restaurant->approval_status_id = 0;
            $restaurant->confirmation_token = Str::random(64);
            
            // 座標（フロントの初期値に合わせて幌別駅）
            $restaurant->latitude = $request->latitude ?: 42.4123;
            $restaurant->longitude = $request->longitude ?: 141.2063;
            
            // ステータス（0: 承認待ち）
            $restaurant->approval_status_id = 0;

            //画像の保存処理
            $basePath = "user_images/{$user->id}/restaurants";

            // TOP画像 (React側は topimages[] 配列で送ってくる)
            if ($request->hasFile('topimages')) {
                $topFile = $request->file('topimages')[0];
                $path = $topFile->store($basePath . "/top", 'public');
                $restaurant->topimage_path = Storage::url($path);
            }

            // サブ画像 (React側は images[] 配列で送ってくる)
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

            //認証メール送信
            $confirmationUrl = url("/api/restaurant-request/confirm?token=" . $restaurant->confirmation_token);
            Mail::to($user->email)->send(new RestaurantApplicationMail($confirmationUrl, $restaurant->name));

            return response()->json(['message' => '店舗情報を送信しました。管理者による承認をお待ちください。'], 201);

        } catch (\Exception $e) {
            Log::error('店舗登録エラー: ' . $e->getMessage());
            return response()->json(['error' => 'サーバーエラーが発生しました'], 500);
        }
    }

    // --- 店舗情報の更新 (一般ユーザー用：再申請) ---
    public function update(Request $request, $id)
    {
        try {
            $restaurant = Restaurant::findOrFail($id);

            // 権限チェック
            if ($restaurant->user_id !== $request->user()->id && !$request->user()->is_admin) {
                return response()->json(['error' => '編集権限がありません'], 403);
            }

            $restaurant->name = $request->input('name', $restaurant->name);
            $restaurant->catchphrase = $request->input('catchphrase', $restaurant->catchphrase);
            $restaurant->tel = $request->input('tel', $restaurant->tel);
            $restaurant->address = $request->input('address', $restaurant->address);
            $restaurant->url = $request->input('url', $restaurant->url);
            $restaurant->comment = $request->input('comment', $restaurant->comment);
            $restaurant->business_hours = $request->input('business_hours', $restaurant->business_hours);
            $restaurant->holiday = $request->input('holiday', $restaurant->holiday);
            $restaurant->genre_id = (int)$request->input('genre_id', $restaurant->genre_id);
            $restaurant->area_id = (int)$request->input('area_id', $restaurant->area_id);
            $restaurant->budget_id = (int)$request->input('budget_id', $restaurant->budget_id);

            // ステータス制御
            if ($request->from_admin === "true") {
                $restaurant->approval_status_id = (int)$request->input('approval_status_id');
            } else {
                $restaurant->approval_status_id = 0;
                $restaurant->confirmation_token = Str::random(64);
                $restaurant->rejection_reason = null; //以前の却下理由をクリア
                $isReapplication = true;
            }

            if (in_array($restaurant->approval_status_id, [0, 3])) {
                $restaurant->rejection_reason = null;
            }

            // 画像の更新（個別ファイルとして topimage, image1, image2, image3 が来る場合を想定）
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

            //メール送信
           if ($needsEmail) {
                $user = $request->user();
                $confirmationUrl = url("/api/restaurant-request/confirm?token=" . $restaurant->confirmation_token);
                Mail::to($user->email)->send(new RestaurantApplicationMail($confirmationUrl, $restaurant->name));
            }

            return response()->json(['message' => '店舗情報を更新しました', 'restaurant' => $restaurant]);

        } catch (\Exception $e) {
            Log::error("店舗更新失敗: " . $e->getMessage());
            return response()->json(['error' => '店舗更新に失敗しました'], 500);
        }
    }

    //メール認証完了メソッド
    public function confirmRestaurant(Request $request)
    {
        $token = $request->query('token');
        $restaurant = Restaurant::where('confirmation_token', $token)->first();

        if (!$restaurant) {
            return response()->json(['error' => '無効なトークンです'], 400);
        }

        //ステータスを 1（審査待ち）に更新
        $restaurant->approval_status_id = 1;
        $restaurant->confirmation_token = null;
        $restaurant->save();

        //認証後のリダイレクト先（ReactのURL）
        return redirect('http://localhost:3000/RestaurantApplicationHistory?verified=true');
    }


    // --- 店舗削除 (論理削除) ---
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

    // --- 詳細取得 ---
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

    // --- 公開中の店舗一覧取得 ---
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

    public function getGenres() { return response()->json(Genre::all()); }
    public function getAreas() { return response()->json(Area::all()); }
    public function getBudgets() { return response()->json(Budget::all()); }
}