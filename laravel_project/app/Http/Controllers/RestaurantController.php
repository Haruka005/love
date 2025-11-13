<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Restaurant;

class RestaurantController extends Controller
{
    //  店舗登録処理（ReactのPOST送信に対応）
    public function storeRestaurantData(Request $request)
    {
        Log::info('storeRestaurantData に到達しました', ['user_id' => $request->input('user_id')]);

        $userId = $request->input('user_id');
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['error' => 'ユーザーが見つかりません'], 404);
        }

        // 初回フォルダ作成
        $folderPath = "user_images/{$user->id}/restaurants";
        if (!$user->has_restaurant_folder) {
            $created = Storage::disk('public')->makeDirectory($folderPath);
            if ($created) {
                $user->has_restaurant_folder = true;
                $user->save();
            }
        }

        // TOP画像保存
        $topImagePath = $request->hasFile('topimages')
            ? $request->file('topimages')->store("user_images/{$user->id}/restaurants/top", 'public')
            : null;

        // 詳細画像保存
        $detailImagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $detailImagePaths[] = $image->store("user_images/{$user->id}/restaurants/detail", 'public');
            }
        }

        // 店舗情報保存（Reactから送られたIDをそのまま使う）
        $restaurant = new Restaurant();
        $restaurant->user_id = $user->id;
        $restaurant->name = $request->input('name');
        $restaurant->catchphrase = $request->input('headline');
        $restaurant->url = $request->input('url');
        $restaurant->address = $request->input('address');
        $restaurant->latitude = $request->input('latitude');
        $restaurant->longitude = $request->input('longitude');
        $restaurant->comment = $request->input('comment');
        $restaurant->budget_id = $request->input('budget_id');
        $restaurant->area_id = $request->input('area_id');
        $restaurant->genre_id = json_encode($request->input('genre_id')); // ← ID配列をそのまま保存

        if ($topImagePath) {
            $restaurant->topimage_path = Storage::url($topImagePath);
        }

        if (!empty($detailImagePaths)) {
            $restaurant->image_paths = json_encode(array_map(fn($p) => Storage::url($p), $detailImagePaths));
        }

        $restaurant->save();

        return response()->json(['message' => 'レストラン情報を保存しました']);
    }

    public function getGenres() {
    return response()->json(\App\Models\Genre::all());
    }
    
    public function getAreas() {
    return response()->json(\App\Models\Area::all());
    }

    public function getBudgets() {
    return response()->json(\App\Models\Budget::all());
    }


    //  店舗一覧取得（ジャンル名付き）
    public function getRestaurant()
    {
        $restaurants = Restaurant::all();

        foreach ($restaurants as $restaurant) {
            $genreIds = json_decode($restaurant->genre_id, true);
            $genreNames = DB::table('m_genres')->whereIn('id', $genreIds)->pluck('name')->toArray();
            $restaurant->genre_names = $genreNames;
        }

        return response()->json($restaurants);
    }
}