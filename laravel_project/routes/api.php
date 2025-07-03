<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/message', function () {
    return ['message' => 'こんにちは、React！'];
});
