<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventImageController;
use App\Http\Controllers\UserController;


//イベントを月ごとに取得
Route::get('/events/{year}/{month}', [EventController::class, 'getByMonth']); 

//今月のイベント取得
Route::get('/events/upcoming',[EventController::class, 'getUpComingEvent']);

//飲食店取得
Route::get('/restaurants/getRestaurant',[RestaurantController::class, 'getUpComingEvent']);

//
Route::middleware('auth:sanctum')->post('/upload-event-image', [EventImageController::class, 'uploadEventImage']);

//新規登録
Route::post('/register', [UserController::class, 'register']);
//ログイン
Route::post('/login', [UserController::class, 'login']);



