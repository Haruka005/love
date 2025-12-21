<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Restaurant extends Model
{
    use HasFactory;
    use SoftDeletes;

    // テーブル名の指定
    protected $table = 'm_restaurants';

    // 一括代入を許可するカラム
    protected $fillable = [
        'user_id',
        'name',
        'catchphrase',
        'tel',
        'address',
        'business_hours',
        'holiday',
        'url',
        'comment',
        'genre_id',
        'area_id',
        'budget_id',
        'latitude',
        'longitude',
        'topimage_path',
        'image1_path',
        'image2_path',
        'image3_path',
        'approval_status_id',
        'rejection_reason'
    ];

    /**
     * ジャンルとのリレーション
     */
    public function genre()
    {
        // genre_id を使って Genre モデル（m_genresテーブル）と紐付けます
        return $this->belongsTo(Genre::class, 'genre_id');
    }

    /**
     * エリアとのリレーション
     */
    public function area()
    {
        // area_id を使って Area モデル（m_areasテーブル）と紐付けます
        return $this->belongsTo(Area::class, 'area_id');
    }

    /**
     * 予算とのリレーション
     */
    public function budget()
    {
        // budget_id を使って Budget モデル（m_budgetsテーブル）と紐付けます
        return $this->belongsTo(Budget::class, 'budget_id');
    }

    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}