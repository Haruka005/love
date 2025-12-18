<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Restaurant;
use App\Models\Genre;
use App\Models\Area;
use App\Models\Budget;

class RestaurantController extends Controller
{
    // --- 店舗登録処理 (React側の送信データ名に完全に合わせました) ---
    public function storeRestaurantData(Request $request)
    {
        Log::info("storeRestaurantData 処理開始", $request->all());

        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'name' => 'required|string|max:255',
            'catchphrase' => 'required|string|max:255',
            'tel' => 'required|string',
            'address' => 'required|string',
            'area_id' => 'required',
            'genre_id' => 'required',
            'budget_id' => 'required',
            'business_hours' => 'required',
            'holiday' => 'required',
            'url' => 'nullable',
            // 画像のバリデーションは、React側のキー名に合わせる
            'topimage' => 'required|image|max:5120', 
            'image1' => 'nullable|image|max:5120',
            'image2' => 'nullable|image|max:5120',
            'image3' => 'nullable|image|max:5120',
        ]);

        if ($validator->fails()) {
            Log::error("バリデーション失敗", $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($request->user_id);
        if (!$user) return response()->json(['error' => 'User not found'], 404);

        $restaurant = new Restaurant();
        
        // データの代入
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
        $restaurant->latitude = $request->latitude ?: 42.4123;
        $restaurant->longitude = $request->longitude ?: 141.2063;
        $restaurant->approval_status_id = 0;

        // 画像保存用パス
        $basePath = "user_images/{$user->id}/restaurants";

        // TOP画像 (React: topimage)
        if ($request->hasFile('topimage')) {
            $path = $request->file('topimage')->store($basePath, 'public');
            $restaurant->topimage_path = Storage::url($path);
        }

        // サブ画像 (React: image1, image2, image3)
        for ($i = 1; $i <= 3; $i++) {
            $key = "image{$i}";
            if ($request->hasFile($key)) {
                $path = $request->file($key)->store($basePath, 'public');
                $col = "image{$i}_path";
                $restaurant->$col = Storage::url($path);
            }
        }

        if ($restaurant->save()) {
            return response()->json(['message' => 'Success'], 201);
        }
        return response()->json(['error' => 'Save failed'], 500);
    }

    // --- 以下、Reactが表示のために必要としているマスターデータ取得API ---
    public function getGenres() { return response()->json(Genre::all()); }
    public function getAreas() { return response()->json(Area::all()); }
    public function getBudgets() { return response()->json(Budget::all()); }

    public function getRestaurant()
    {
    try {
        // モデル Restaurant.php で protected $table = 'm_restaurants'; 
        // が設定されていれば、これで取得できます。
        $restaurants = Restaurant::with(['genre', 'area', 'budget'])->get();
        return response()->json($restaurants);
    } catch (\Exception $e) {
        // 何かエラーがあればログに出力
        Log::error("一覧取得エラー: " . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }
    }

    
    public function show($id)
    {
        $restaurant = Restaurant::with(['genre', 'area', 'budget'])->find($id);
        if (!$restaurant) return response()->json(['message' => 'Not found'], 404);
        
        $images = array_filter([
            $restaurant->topimage_path,
            $restaurant->image1_path,
            $restaurant->image2_path,
            $restaurant->image3_path
        ]);
        $restaurant->images = $images;
        return response()->json($restaurant);
    }
}