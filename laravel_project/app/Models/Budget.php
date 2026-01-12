<?php

//予算マスタ・モデル
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    use HasFactory;

    protected $table = 'm_budgets'; // 実際のテーブル名
    protected $fillable = ['name']; // マスタのカラム
}
