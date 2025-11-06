<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Restaurant; // モデルを読み込み

class RestaurantController extends Controller
{
    //すべての飲食店情報取得
    public function getRestaurant()
    {
        //データベースから取得
        $restaurants = Restaurant::with(['genre', 'area', 'budget'])->get();

        //json形式で返す
        return response()->json($restaurants);
    }

}