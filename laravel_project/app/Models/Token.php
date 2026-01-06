<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    use HasFactory;

    protected $table = 'token';

    protected $fillable = [
        'user_id',
        'token',
        'token_expires_at',
        'last_used_at',
        'expired_flg',
    ];

    //日付カラムをcarbonオブジェクトにキャスト
    //carbon→日付を文字列ではなく時刻として扱ってくれる
    protected $casts = [
        // Laravelに、これらのカラムをCarbonオブジェクト（日付型）として扱わせる
        'token_expires_at' => 'datetime',
        'last_used_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
