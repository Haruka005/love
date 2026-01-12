<?php

//管理者ログイン・トークン発行機能


namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // ユーザー一覧を取得
    public function user_all()
    {

        return response()->json(User::all());
    }

}
