<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    //テストイベントテーブルを使用しますよ　ってこと
     protected $table = 'test_events';

     public function user()
     {
        return $this->belongsTo(User::class);
     }


}
