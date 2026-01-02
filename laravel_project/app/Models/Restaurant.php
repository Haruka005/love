<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Restaurant extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'm_restaurants';

    protected $fillable = [
        'user_id',
        'name',
        'catchphrase',
        'comment',
        'url',
        'area_id',
        'genre_id',
        'budget_id',
        'latitude',
        'longitude',
        'address',
        'tel',
        'topimage_path',
        'image1_path',
        'image2_path',
        'image3_path',
        'approval_status_id',
        'rejection_reason',
        'confirmation_token',
    ];

    public function genre()
    {
        return $this->belongsTo(Genre::class, 'genre_id');
    }

    // エリアとの関係（1レストランは1エリア）
    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id');
    }

    public function budget()
    {
        return $this->belongsTo(Budget::class, 'budget_id');
    }

    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}