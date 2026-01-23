<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Token;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * ユーザー一覧取得 (検索・ステータス判定込み)
     */
    public function index(Request $request)
    {
        $query = User::query();

        // 1. 検索ロジック
        if ($request->filled('search')) {
            $keyword = $request->search;
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->orWhere('email', 'like', "%{$keyword}%");
            });
        }

        // 2. ロールフィルタ
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // 3. 【重要】アカウント状態フィルタ
        if ($request->has('status') && $request->status !== '') {
            $statusValue = (string)$request->status; // 文字列として扱う
            if ($statusValue === "0") {
                // 明示的に 0 の人だけを取得。NULL は含まれない。
                $query->where('user_status', 0);
            } else {
                // 有効(1)を選択した場合、0以外(1やNULL)のユーザーを表示
                $query->where(function($q) {
                    $q->where('user_status', '!=', 0)
                      ->orWhereNull('user_status');
                });
            }
        }

        $users = $query->orderBy('id', 'desc')->get()->map(function ($user) {
            
            // オンライン判定
            $user->is_online = Token::where('user_id', $user->id)
                ->where('token_expires_at', '>', now())
                ->exists();

            // ロック判定 (バッジ表示用)
            $user->is_locked = (bool)($user->is_locked || $user->locked_at !== null);

            return $user;
        });

        return response()->json($users);
    }

    /**
     * 更新処理
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|min:12',
            'user_status' => 'required|integer|in:0,1',
            'is_locked' => 'nullable|boolean',
            'role' => 'required|string|in:admin,user',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->user_status = $validated['user_status'];
        $user->role = $validated['role'];

        if (isset($validated['is_locked'])) {
            if ($validated['is_locked'] === false) {
                $user->is_locked = false;
                $user->login_attempts = 0;
                $user->locked_at = null;
            } else {
                $user->is_locked = true;
                if (!$user->locked_at) {
                    $user->locked_at = now();
                }
            }
        }

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json(['message' => '更新しました', 'user' => $user]);
    }

    /**
     * ログイン履歴取得
     */
    public function loginHistory($id)
    {
        $history = Token::where('user_id', $id)
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();
        return response()->json($history);
    }

    /**
     * ユーザー削除
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        Token::where('user_id', $id)->delete();
        $user->delete();
        return response()->json(['message' => 'Deleted']);
    }

    /**
     * 自分自身の情報
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}

