<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventImageController;





Route::get('/message', function () {
    return ['message' => 'こんにちは、React！'];
});

Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->post('/upload-event-image', [EventImageController::class, 'uploadEventImage']);



