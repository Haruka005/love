<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Restaurant; // モデルを読み込み

class RestaurantController extends Controller
{
    // すべての飲食店情報取得
    public function getRestaurant()
    {
        // データベースから取得
        $restaurants = Restaurant::with(['genre', 'area', 'budget'])->get();

        // JSON形式で返す
        return response()->json($restaurants);
    }

    // 飲食店詳細を取得
    public function show($id)
    {
         $restaurant = Restaurant::with(['genre', 'area', 'budget'])->find($id);

        if (!$restaurant) {
            return response()->json(['message' => '飲食店が見つかりません'], 404);
        }

        return response()->json($restaurant);
    }
}
