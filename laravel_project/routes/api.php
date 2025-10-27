<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventImageController;


//イベントを月ごとに取得
Route::get('/events/{year}/{month}', [EventController::class, 'getByMonth']); 

//今月のイベント取得
Route::get('/events/upcoming',[EventController::class, 'getUpComingEvent']);


Route::get('/message', function () {
    return ['message' => 'こんにちは、React！'];
});

Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->post('/upload-event-image', [EventImageController::class, 'uploadEventImage']);



