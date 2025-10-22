<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;

//イベントを月ごとに取得
Route::get('/events/{year}/{month}', [EventController::class, 'getByMonth']); 

//今月のイベント取得
Route::get('/events/upcoming',[EventController::class, 'getUpComingEvent']);