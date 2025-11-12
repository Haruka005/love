<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventImageController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\AdminController;


//イベントを月ごとに取得
Route::get('/events/{year}/{month}', [EventController::class, 'getByMonth']); 

//今月のイベント取得
Route::get('/events/upcoming',[EventController::class, 'getUpComingEvent']);

//イベント詳細取得
Route::get('/events/{id}', [EventController::class, 'show']);

//飲食店取得
Route::get('/restaurants',[RestaurantController::class, 'getRestaurant']);

//
Route::middleware('auth:sanctum')->post('/upload-event-image', [EventImageController::class, 'uploadEventImage']);

//新規登録
Route::post('/register', [UserController::class, 'register']);
//ログイン
Route::post('/login', [UserController::class, 'login']);

//管理者ユーザー取得
Route::get('/users', [AdminController::class, 'user_all']);



