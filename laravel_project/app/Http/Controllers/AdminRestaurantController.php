<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Restaurant;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AdminRestaurantController extends Controller
{
    // 未承認 & 再申請
    public function getPendingShops(Request $request)
    {
        // ★ 管理者チェック
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $restaurants = Restaurant::with(['genre', 'area', 'budget', 'user'])
                        ->whereIn('approval_status_id', [0, 3])
                        ->orderBy('created_at', 'desc')
                        ->get();

        return response()->json($restaurants);
    }

    // 承認済み or 非公開
    public function getApprovedShops(Request $request)
    {
        // ★ 管理者チェック
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

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

    // ステータス更新
    public function updateStatus(Request $request, $id)
    {
        // ★ 管理者チェック
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'approval_status_id' => 'required|integer',
            'rejection_reason' => 'nullable|string'
        ]);

        $restaurant = Restaurant::findOrFail($id);
        $newStatus = (int)$request->approval_status_id;
        $restaurant->approval_status_id = $newStatus;

        if ($newStatus === 2) {
            $restaurant->rejection_reason = $request->rejection_reason;
        } else {
            $restaurant->rejection_reason = null;
        }

        $restaurant->save();
        return response()->json(['message' => 'ステータスを更新しました']);
    }

    // 店舗詳細
    public function show($id)
    {
        // ★ 管理者チェック
        if (request()->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $shop = Restaurant::with(['genre', 'area', 'budget', 'user'])->find($id);

        if (!$shop) {
            return response()->json(['message' => '店舗が見つかりません'], 404);
        }

        return response()->json($shop);
    }

    // 全店舗一覧
    public function index(Request $request)
    {
        // ★ 管理者チェック
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(
            Restaurant::with(['genre', 'area', 'budget', 'user'])->get()
        );
    }

    // 店舗情報更新
    public function update(Request $request, $id)
    {
        // ★ 管理者チェック
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $restaurant = Restaurant::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
        ]);

        $data = $request->except(['topimage', 'image1', 'image2', 'image3', '_method']);

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

        if ($request->has('approval_status_id')) {
            $newStatus = (int)$request->approval_status_id;
            $data['approval_status_id'] = $newStatus;

            if (in_array($newStatus, [0, 1, 3])) {
                $data['rejection_reason'] = null;
            }
        }

        $restaurant->update($data);

        return response()->json([
            'message' => '店舗情報を更新しました',
            'restaurant' => $restaurant
        ]);
    }
}

