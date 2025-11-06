<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
        // 保存を許可するカラム（ホワイトリスト）
    protected $fillable = [
        'user_id',
        'name',
        'catchphrase',
        'description',
        'url',
        'address',
        'comment',
        'budget_id',
        'area_id',
        'genre_id',
        'topimage_path',
        'image_paths',
    ];

    // JSONカラムを配列として扱う
    protected $casts = [
        'genre_id' => 'array',
        'image_paths' => 'array',
    ];

}
