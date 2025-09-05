<?php

use Illuminate\Support\Facades\Route;

Route::get('/test-message', function () {
    return ['message' => 'これはweb.php経由のメッセージです'];
});

