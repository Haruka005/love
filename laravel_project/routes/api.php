<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\event_get;

//イベントを月ごとに取得
Route::get('/events/{yaer}/{month}', [EventController::class, 'getByMonth']); 
