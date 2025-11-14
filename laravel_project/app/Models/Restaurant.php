<?php

//モデルは1テーブルにつき1個（基本的には）

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    use HasFactory;

    // もしテーブル名がモデル名と違う場合は明示
    protected $table = 'm_restaurants';

    // 書き換え可能なカラムを指定（任意）
    protected $fillable = [
        'name',
        'catchphrase',
        'description',
        'url',
        'area_id',
        'genre_id',
        'budget_id',
        'latitude',
        'longitude',
        'address',
        'tel',
    ];

    //他のテーブルとの関係
     public function genre()
    {
        return $this->belongsTo(Genre::class, 'genre_id'); // 外部キー明示
    }

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
