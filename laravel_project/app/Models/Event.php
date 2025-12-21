<?php

//モデルは1テーブルにつき1個（基本的には）

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
//論理的に削除するときに使用
use Illuminate\Database\Eloquent\SoftDeletes; 

class Event extends Model
{
    use HasFactory;
    use SoftDeletes;

    // もしテーブル名がモデル名と違う場合は明示
    //とりあえず第一正規化からデータを取得している
    protected $table = 'test_events';

    protected $casts = [
        'is_free_participation' => 'integer',
    ];
    

    // 書き換え可能なカラムを指定（任意）
    protected $fillable = [
    'user_id',
    'name',
    'catchphrase',
    'description',
    'start_date',
    'end_date',
    'location',
    'url',
    'notes',
    'organizer',
    'is_free_participation',
    'is_open_enrollment',
    'approval_status_id', // 承認ステータス
    'rejection_reason',   // 却下理由
    'image_path',         // 画像
];
}
