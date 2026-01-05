<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

// トップページ（welcome.blade.php を表示）
Route::get('/', function () {
    return view('welcome');
});

// 管理者ログインページ
Route::get('/login', function () {
    return view('auth.login'); // ログイン画面に合わせて変更
})->name('login');

// ユーザー管理画面（一覧）
Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users');

// ユーザー編集画面（モーダル用にも単体アクセス可能）
Route::get('/admin/users/{id}/edit', [UserController::class, 'edit'])->name('admin.users.edit');

// ユーザー更新（保存ボタン押したとき）
Route::put('/admin/users/{id}', [UserController::class, 'update'])->name('admin.users.update');
