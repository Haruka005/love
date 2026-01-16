<?php

//ジャンルマスタ・モデル
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    use HasFactory;

    protected $table = 'm_genres'; // テーブル名
    protected $fillable = ['name']; // マスタのカラム
}
