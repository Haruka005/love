<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Token;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * ユーザー一覧取得（検索・オンライン判定付き）
     */
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('search')) {
            $keyword = $request->search;
            $query->where(function($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->orWhere('email', 'like', "%{$keyword}%");
            });
        }

        $users = $query->orderBy('id', 'desc')->get()->map(function($user) {
            // トークンの有効期限が現在より後のレコードが存在すればオンライン
            $isLoggedIn = Token::where('user_id', $user->id)
                ->where('token_expires_at', '>', now())
                ->exists();

            $user->is_online = $isLoggedIn;
            return $user;
        });

        return response()->json($users);
    }

    /**
     * ユーザー更新（名前、メール、パスワード）
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|min:12', // パスワードは任意
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = \Illuminate\Support\Facades\Hash::make($validated['password']);
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
        $user->delete();

        return response()->json(['message' => 'Deleted']);
    }
}

