<?php

//イベント画像・モデル
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EventImage extends Model
{

    use HasFactory;

    //テーブル名を指定
    protected $table = "test_events";

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
        'approval_status_id',
        'rejection_reason',
        'image_path',
        'confirmation_token',
    ];
}
