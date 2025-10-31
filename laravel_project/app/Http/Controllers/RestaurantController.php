<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Restaurant; // モデルを読み込み

class RestaurantController extends Controller
{
    //すべての飲食店情報取得
    public function index()
    {
        $restaurants = Restaurant::all();
        return response()->json($restaurants);
    }

}