<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    
    use HasFactory, Notifiable;

    // 明示的にテーブル名を指定（通常は不要だけど、明示したい場合）
    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'user_status',
        'is_locked',
        'login_attempts',
        'locked_at',
        'has_image_folder',

    ];

    //隠すカラム
    protected $hidden = [
        'password',
        'remember_token',
    ];

   
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'has_image_folder' => 'boolean',
        'is_locked' => 'boolean',
        'locked_at' => 'datetime'   
    ];

    //Tokenリレーション定義
    //ログアウト時にこのメソッドを呼び出しトークンを削除
    public function tokens()
    {
        return $this->hasMany(Token::class);
    }
}

