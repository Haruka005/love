<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Restaurant;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AdminRestaurantController extends Controller
{
    /**
     * 未承認(0) および 再申請(3) の店舗一覧
     */
    public function getPendingShops()
    {
        $restaurants = Restaurant::with(['genre', 'area', 'budget', 'user'])
                        ->whereIn('approval_status_id', [0, 3]) 
                        ->orderBy('created_at', 'desc')
                        ->get();

        return response()->json($restaurants);
    }

    /**
     * 承認済み(1) または 非公開(9) の店舗一覧
     */
    public function getApprovedShops(Request $request)
    {
        $status = $request->query('status', 1);
        $yearMonth = $request->query('year_month'); 

        $query = Restaurant::where('approval_status_id', $status)
                        ->with(['genre', 'area', 'budget', 'user']);

        if ($yearMonth && $yearMonth !== 'undefined') {
            $query->where('created_at', 'like', $yearMonth . '%');
        }

        $restaurants = $query->orderBy('created_at', 'desc')->get();
        return response()->json($restaurants);
    }

    /**
     * ステータス更新（承認・拒否・非公開）
     * 管理者画面のボタン操作（承認・却下）用
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'approval_status_id' => 'required|integer',
            'rejection_reason' => 'nullable|string'
        ]);

        $restaurant = Restaurant::findOrFail($id);
        $newStatus = (int)$request->approval_status_id;
        $restaurant->approval_status_id = $newStatus;

        if ($newStatus === 2) {
            // 却下の場合は理由を保存
            $restaurant->rejection_reason = $request->rejection_reason;
        } else {
            // 承認(1)やその他(0, 3)の場合は、理由をクリア
            $restaurant->rejection_reason = null; 
        }

        $restaurant->save();
        return response()->json(['message' => 'ステータスを更新しました']);
    }

    /**
     * 特定の店舗詳細取得 (編集画面の初期値用)
     */
    public function show($id)
    {
        $shop = Restaurant::with(['genre', 'area', 'budget', 'user'])->find($id);
        
        if (!$shop) {
            return response()->json(['message' => '店舗が見つかりません'], 404);
        }

        return response()->json($shop);
    }

    /**
     * 全店舗一覧
     */
    public function index()
    {
        return response()->json(
            Restaurant::with(['genre', 'area', 'budget', 'user'])->get()
        );
    }

    /**
     * 店舗情報の更新保存 (管理者モードでの編集処理)
     */
    public function update(Request $request, $id)
    {
        $restaurant = Restaurant::findOrFail($id);

        // バリデーション
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
        ]);

        // 基本データ（画像以外）をまとめる
        $data = $request->except(['topimage', 'image1', 'image2', 'image3', '_method']);

        // --- 画像保存ロジック (Storage::urlに統一) ---
        $basePath = "user_images/{$restaurant->user_id}/restaurants";

        if ($request->hasFile('topimage')) {
            $path = $request->file('topimage')->store($basePath, 'public');
            $data['topimage_path'] = Storage::url($path);
        }

        for ($i = 1; $i <= 3; $i++) {
            $key = 'image' . $i;
            $pathKey = 'image' . $i . '_path';
            if ($request->hasFile($key)) {
                $path = $request->file($key)->store($basePath, 'public');
                $data[$pathKey] = Storage::url($path);
            }
        }

        // --- ステータス制御ロジック ---
        if ($request->has('approval_status_id')) {
            $newStatus = (int)$request->approval_status_id;
            $data['approval_status_id'] = $newStatus;
            
            // 新規(0)、承認(1)、再申請(3)が選ばれた場合は、却下理由をクリアする
            if (in_array($newStatus, [0, 1, 3])) {
                $data['rejection_reason'] = null;
            }
        }

        // データベース更新
        $restaurant->update($data);

        return response()->json([
            'message' => '店舗情報を更新しました',
            'restaurant' => $restaurant
        ]);
    }
}