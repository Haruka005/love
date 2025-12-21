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
    // --- ログインユーザーの登録店舗一覧 ---
    public function index(Request $request)
    {
        try {
            $userId = $request->user()->id;
            
            $restaurants = Restaurant::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get([
                    'id', 
                    'user_id', 
                    'name', 
                    'catchphrase', 
                    'tel', 
                    'address', 
                    'url', 
                    'comment', 
                    'business_hours', 
                    'holiday', 
                    'genre_id', 
                    'area_id', 
                    'budget_id', 
                    'topimage_path', 
                    'approval_status_id', 
                    'rejection_reason'
                ]);

            return response()->json($restaurants);
        } catch (\Exception $e) {
            return response()->json(['error' => '店舗一覧の取得に失敗しました'], 500);
        }
    }

    // --- 店舗登録処理 ---
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
            'topimage' => 'required|image|max:5120', 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($request->user_id);
        if (!$user) return response()->json(['error' => 'User not found'], 404);

        $restaurant = new Restaurant();
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
        $restaurant->rejection_reason = null;

        $basePath = "user_images/{$user->id}/restaurants";

        if ($request->hasFile('topimage')) {
            $path = $request->file('topimage')->store($basePath, 'public');
            $restaurant->topimage_path = Storage::url($path);
        }

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

    // --- 店舗情報の更新 (一般ユーザー用：再申請対応) ---
    public function update(Request $request, $id)
    {
        try {
            $restaurant = Restaurant::findOrFail($id);

            // 基本情報の更新
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

            // --- ステータス制御ロジック ---
            if ($request->has('from_admin') && $request->from_admin == "true") {
                // 管理者モードからのリクエストなら、送られてきたステータスをそのまま使う
                $restaurant->approval_status_id = (int)$request->input('approval_status_id');
            } else {
                // 一般ユーザーの編集（再申請）なら、強制的に「3」にする
                $restaurant->approval_status_id = 3;
            }

            // 新規申請(0)または再申請(3)の場合は、過去の拒否理由をクリア
            // ※ここで未定義だった $newStatus を $restaurant->approval_status_id に修正しました
            if (in_array($restaurant->approval_status_id, [0, 3])) {
                $restaurant->rejection_reason = null;
            }

            // 画像の更新
            $basePath = "user_images/{$restaurant->user_id}/restaurants";
            if ($request->hasFile('topimage')) {
                $path = $request->file('topimage')->store($basePath, 'public');
                $restaurant->topimage_path = Storage::url($path);
            }
            for ($i = 1; $i <= 3; $i++) {
                $key = "image{$i}";
                if ($request->hasFile($key)) {
                    $path = $request->file($key)->store($basePath, 'public');
                    $col = "image{$i}_path";
                    $restaurant->$col = Storage::url($path);
                }
            }

            $restaurant->save();
            return response()->json(['message' => '店舗情報を更新（再申請）しました', 'restaurant' => $restaurant]);

        } catch (\Exception $e) {
            Log::error("店舗更新失敗: " . $e->getMessage());
            return response()->json(['error' => '店舗更新に失敗しました'], 500);
        }
    }

    // --- 店舗削除 (論理削除) ---
    public function destroy(Request $request, $id)
    {
        try {
            $restaurant = Restaurant::findOrFail($id);

            if ($restaurant->user_id !== $request->user()->id) {
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
                ->where('approval_status_id', 1) 
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