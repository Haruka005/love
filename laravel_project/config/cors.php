<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout','me'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        # ローカル
        #'http://localhost:3000',
        #物理サーバー
        'http://172.16.117.200:3000',
        '*',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];