<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Restaurant;

class RestaurantController extends Controller
{
    public function storeRestaurantData(Request $request)
    {
        Log::info('storeRestaurantData に到達しました', ['user_id' => $request->input('user_id')]);

        // ユーザー取得
        $userId = $request->input('user_id');
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['error' => 'ユーザーが見つかりません'], 404);
        }

        // ユーザー画像フォルダ作成（初回のみ）
        $folderPath = "user_images/{$user->id}/restaurants";
        if (!$user->has_restaurant_folder) {
            $created = Storage::disk('public')->makeDirectory($folderPath);
            Log::info('レストランフォルダ作成', ['path' => $folderPath, 'created' => $created]);

            if ($created) {
                $user->has_restaurant_folder = true;
                $user->save();
                Log::info('has_restaurant_folder フラグを true に更新しました');
            }
        }

        // TOP画像保存
        $topImagePath = null;
        if ($request->hasFile('topimages')) {
            $topImagePath = $request->file('topimages')->store("user_images/{$user->id}/restaurants/top", 'public');
        }

        // 詳細画像保存（最大3枚）
        $detailImagePaths = [];
        if ($request->hasFile('images') && is_array($request->file('images'))) {
            foreach ($request->file('images') as $image) {
                $detailImagePaths[] = $image->store("user_images/{$user->id}/restaurants/detail", 'public');
            }
        }

        // ジャンル名 → ID配列変換
        $genreIds = $this->resolveGenreIds($request->input('genre_id'));

        // 地域名 → ID変換
        $areaId = $this->resolveAreaId($request->input('area_id'));

        // 店舗情報保存
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
        $restaurant->area_id = $areaId;
        $restaurant->genre_id = json_encode($genreIds);

        if ($topImagePath) {
            $restaurant->topimage_path = Storage::url($topImagePath);
        }

        if (!empty($detailImagePaths)) {
            $restaurant->image_paths = json_encode(array_map(fn($p) => Storage::url($p), $detailImagePaths));
        }

        $restaurant->save();

        return response()->json(['message' => 'レストラン情報を保存しました']);
    }

    // 地域名 → ID変換（m_t_areas）
    private function resolveAreaId($areaName)
    {
        $area = \DB::table('m_t_areas')->where('name', $areaName)->first();
        return $area ? $area->id : null;
    }

    // ジャンル名 → ID配列変換（m_t_genres）
    private function resolveGenreIds($genreNames)
    {
        if (!is_array($genreNames)) return [];

        return \DB::table('m_t_genres')
            ->whereIn('name', $genreNames)
            ->pluck('id')
            ->toArray();
    }
}

