<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventGetController;

//イベントを月ごとに取得
Route::get('/events/{year}/{month}', [EventGetController::class, 'getByMonth']); 
