<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout','me'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://172.16.117.200:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://172.16.117.200:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3002',
    'http://172.16.117.200:3002',
],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];