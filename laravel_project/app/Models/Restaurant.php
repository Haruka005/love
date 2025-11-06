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

    //他のテーブルとの関係
     public function genre()
    {
        return $this->belongsTo(Genre::class, 'genre_id'); // 外部キー明示
    }

    // エリアとの関係（1レストランは1エリア）
    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id');
    }

    // 予算との関係（1レストランは1予算）
    public function budget()
    {
        return $this->belongsTo(Budget::class, 'budget_id');
    }
}
