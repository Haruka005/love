<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Restaurant;
use App\Models\Genre;
use App\Models\Area;
use App\Models\Budget;

class RestaurantController extends Controller
{
    // 店舗登録処理
    public function storeRestaurantData(Request $request)
    {
        Log::info('storeRestaurantData に到達しました', ['user_id' => $request->input('user_id')]);

        $user = User::find($request->input('user_id'));
        if (!$user) {
            return response()->json(['error' => 'ユーザーが見つかりません'], 404);
        }

        // フォルダ作成
        $folderPath = "user_images/{$user->id}/restaurants";
        if (!$user->has_restaurant_folder) {
            if (Storage::disk('public')->makeDirectory($folderPath)) {
                $user->has_restaurant_folder = true;
                $user->save();
            }
        }

        $restaurant = new Restaurant();
        $restaurant->user_id = $user->id;

        // TOP画像
        if ($request->hasFile('topimages')) {
            $topImagePath = $request->file('topimages')[0]->store("user_images/{$user->id}/restaurants/top", 'public');
            $restaurant->topimage_path = Storage::url($topImagePath);
        } else {
            return response()->json(['error' => 'TOP画像は必須です'], 422);
        }

        // 詳細画像
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                if ($index < 3 && $image) {
                    $path = $image->store("user_images/{$user->id}/restaurants/detail", 'public');
                    $restaurant->{'image'.($index + 1).'_path'} = Storage::url($path);
                }
            }
        }

        // 入力情報
        $restaurant->name = $request->input('name');
        $restaurant->catchphrase = $request->input('catchphrase');
        $restaurant->url = $request->input('url');
        $restaurant->address = $request->input('address');
        $restaurant->latitude = $request->input('latitude') ?: 42.4123;
        $restaurant->longitude = $request->input('longitude') ?: 141.2063;
        $restaurant->comment = $request->input('comment');
        $restaurant->budget_id = $request->input('budget_id');
        $restaurant->area_id = $request->input('area_id');
        $restaurant->genre_id = $request->input('genre_id'); // ✅ 単一ジャンル
        $restaurant->tel = $request->input('tel');

        $restaurant->save();

        return response()->json(['message' => 'レストラン情報を保存しました']);
    }

    // マスターデータ取得
    public function getGenres()
    {
        return response()->json(Genre::all());
    }

    public function getAreas()
    {
        return response()->json(Area::all());
    }

    public function getBudgets()
    {
        return response()->json(Budget::all());
    }

    // 店舗一覧取得（リレーション付き）
    public function getRestaurant()
    {
        $restaurants = Restaurant::with(['genre', 'area', 'budget'])->get();
        return response()->json($restaurants);
    }

    // 店舗詳細取得
    public function show($id)
    {
        $restaurant = Restaurant::with(['genre', 'area', 'budget'])->find($id);

        if (!$restaurant) {
            return response()->json(['message' => '店舗が見つかりません'], 404);
        }

        return response()->json($restaurant);
    }
}