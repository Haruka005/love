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

}
