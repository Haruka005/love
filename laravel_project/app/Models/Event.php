<?php

//モデルは1テーブルにつき1個（基本的には）

//イベント・モデル
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
    protected $table = 't_events';

    protected $casts = [
        'is_free_participation' => 'integer',
        'is_open_enrollment' => 'integer',
    ];
    

    // 書き換え可能なカラムを指定
    // ここにカラム名がないと、保存（insert/update）時に無視されます
    protected $fillable = [
        'user_id',
        'name',
        'catchphrase',
        'description',        // あなたの意図：注意事項
        'notes',              // あなたの意図：詳細説明
        'start_date',
        'end_date',
        'location',
        'url',
        'organizer',
        'is_free_participation',
        'is_open_enrollment',
        'approval_status_id',
        'rejection_reason',
        'confirmation_token', 
        'image_path',
    ];

    // 必要に応じてリレーションを追加
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}