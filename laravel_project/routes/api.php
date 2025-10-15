<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;




Route::get('/message', function () {
    return ['message' => 'こんにちは、React！'];
});

Route::post('/register', [AuthController::class, 'register']);

