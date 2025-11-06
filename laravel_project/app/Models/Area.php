<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $table = 'm_areas'; // 実際のテーブル名
    protected $fillable = ['name']; // マスタのカラム
}
