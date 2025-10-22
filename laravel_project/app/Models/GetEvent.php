<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GetEvent extends Model
{
    use HasFactory;

    // もしテーブル名がモデル名と違う場合は明示
    protected $table = 'test_events';

    // 書き換え可能なカラムを指定（任意）
    protected $fillable = [
        'name',
        'catchphrase',
        'start_date',
        'end_date',
    ];
}
