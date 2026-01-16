<?php

//メール認証コード・モデル
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailVerification extends Model
{
    use HasFactory;

    //使用するテーブル名
    protected $table = 'verifications_codes';

    //書き込みを許可するカラムを指定
    protected $fillable = [
        'email',
        'user_id',
        'code',
        'used_at',
        'expires_at',
    ];

    //日付として扱うカラム
    protected $casts = [
        'used_at' => 'datetime',
        'expires_at' => 'datetime',
    ];
}