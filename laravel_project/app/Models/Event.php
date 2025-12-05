<?php

//モデルは1テーブルにつき1個（基本的には）

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    // もしテーブル名がモデル名と違う場合は明示
    //とりあえず第一正規化からデータを取得している
    protected $table = 'test_events';
    //protected $table = 'm_events';
    

    // 書き換え可能なカラムを指定（任意）
    protected $fillable = [
        'name',
        'catchphrase',
        'start_date',
        'end_date',
        'location'
    ];
}
