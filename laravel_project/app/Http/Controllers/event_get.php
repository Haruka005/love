<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event; //Eventモデル使う
use Carbon\Carbon; //日付処理簡単になるやつ使う

class event_get extends Controller
{
    //指定された年月のイベントを取得する
    public function getbyMonth($year,$month)
    {
         // 月の初日と末日をCarbonで求める
        $startOfMonth = Carbon::create($year, $month, 1)->startOfMonth(); //carbonは日付を簡単に持ってくるやつ元から決まってる関数だから変えない
        $endOfMonth = Carbon::create($year, $month, 1)->endOfMonth();

        $events = Event::whereBetween('date',[$startOfMonth,$endOfMonth])
            ->orderBy('date','asc')//開催日の昇順に並び替え
             ->get(['id', 'name', 'catchphrase', 'description','url','start_date','end_date','is_open_enrollment','is_free_participation']); // 欲しいカラムだけ選択

        // JSONで返す
        return response()->json($events);
    }
}
