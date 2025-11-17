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

        //店舗のインスタンスを作成する
        $restaurant = new Restaurant();
        $restaurant -> user_id=$user->id;

        // TOP画像保存
       if ($request->hasFile('topimages')) {
            $topImagePath = $request->file('topimages')[0]->store("user_images/{$user->id}/restaurants/top", 'public');
            $restaurant->topimage_path = Storage::url($topImagePath);
        } else {
            return response()->json(['error' => 'TOP画像は必須です'], 422);
        }

        // 詳細画像保存
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index=>$image) {
                if($index<3){
                    $path = $image->store("user_images/{$user->id}/restaurants/detail", 'public');
                    $restaurant->{`image`.($index+1).`_path`}=Storage::url($path);
                }
            }
        }

                

        // 店舗情報保存（Reactから送られたIDをそのまま使う）
        $restaurant->user_id = $user->id;
        $restaurant->name = $request->input('name');
        $restaurant->catchphrase = $request->input('catchphrase');
        $restaurant->url = $request->input('url');
        $restaurant->address = $request->input('address');
        $defaultLat = 42.4123;
        $defaultLon = 141.2063;
        $restaurant->latitude = $request->input('latitude') ?: $defaultLat;
        $restaurant->longitude = $request->input('longitude') ?: $defaultLon;
        $restaurant->comment = $request->input('comment');
        $restaurant->budget_id = $request->input('budget_id');
        $restaurant->area_id = $request->input('area_id');
        $restaurant->genre_id = json_encode($request->input('genre_id')); // ← ID配列をそのまま保存
        $restaurant->tel = $request->input('tel');


        if ($topImagePath) {
            $restaurant->topimage_path = Storage::url($topImagePath);
        }

    $detailImagePaths = [];

    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $index => $image) {
            if ($index < 3 && $image) {
                $path = $image->store("user_images/{$user->id}/restaurants/detail", 'public');
                $url = Storage::url($path);
                $restaurant->{'image'.($index + 1).'_path'} = $url;
                $detailImagePaths[] = $url;
            }
        }
    }

        if (!empty($detailImagePaths)) {
            $restaurant->image_paths = json_encode($detailImagePaths);
        $restaurant->image_paths = json_encode(array_map(fn($p) => Storage::url($p), $detailImagePaths));
        }

        $restaurant->save();

        return response()->json(['message' => 'レストラン情報を保存しました']);
    }

    //ジャンル、地域、予算の選択肢を取得するためのAPI
    public function getGenres() {
    return response()->json(\App\Models\Genre::all());
    }
    
    public function getAreas() {
    return response()->json(\App\Models\Area::all());
    }

    public function getBudgets() {
    return response()->json(\App\Models\Budget::all());
    }


    //リアクト表示の時にIDだけでは、名前が判らない時に名前表示するために使用している
    //  店舗一覧取得（ジャンル名付き）
    public function getRestaurant()
    {
    $restaurants = Restaurant::with(['area', 'budget'])->get();

    foreach ($restaurants as $restaurant) {
        $genreIds = json_decode($restaurant->genre_id ?? '[]', true);
        if (is_array($genreIds) && !empty($genreIds)) {
            $genreNames = DB::table('m_genres')->whereIn('id', $genreIds)->pluck('name')->toArray();
        } else {
            $genreNames = [];
        }
        $restaurant->genre_names = $genreNames;
    }

    return response()->json($restaurants);
    }

    // 店舗詳細取得（ID指定）
public function show($id)
{
    $restaurant = Restaurant::with(['genre', 'area', 'budget'])->find($id);

    if (!$restaurant) {
        return response()->json(['message' => '店舗が見つかりません'], 404);
    }

    // 複数ジャンル対応
    $genreIds = json_decode($restaurant->genre_id ?? '[]', true);
    $genreNames = is_array($genreIds) && !empty($genreIds)
        ? DB::table('m_genres')->whereIn('id', $genreIds)->pluck('name')->toArray()
        : [];

    $restaurant->genre_names = $genreNames;

    return response()->json($restaurant);
}
}