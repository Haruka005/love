<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event; //Eventモデル使う
use Carbon\Carbon; //日付処理簡単になるやつ使う

class EventGetController extends Controller
{
    //指定された年月のイベントを取得する
    public function getByMonth($year,$month)
    {
        /*
         // 月の初日と末日をCarbonで求める
        $startOfMonth = Carbon::create($year, $month, 1)->startOfMonth(); //carbonは日付を簡単に持ってくるやつ元から決まってる関数だから変えない
        $endOfMonth = Carbon::create($year, $month, 1)->endOfMonth();

        $events = Event::whereBetween('date',[$startOfMonth,$endOfMonth])
            ->orderBy('date','asc')//開催日の昇順に並び替え
             ->get(['id', 'name', 'catchphrase', 'description','url','start_date','end_date','is_open_enrollment','is_free_participation']); // 欲しいカラムだけ選択
        */

        //test
         $eventsByMonth = [
            "2025-10" => [
                ["id"=>1,"title"=>"紅葉ライトアップ","date"=>"2025-10-10","description"=>"温泉街の紅葉を幻想的に照らす"],
                ["id"=>2,"title"=>"登別グルメフェス","date"=>"2025-10-22","description"=>"地元の味覚が集結する食の祭典"]
            ]
        ];

        $key = sprintf('%04d-%02d', $year, $month);
        $events = $eventsByMonth[$key] ?? [];
        //ここまで

        // JSONで返す
        return response()->json($events);
    }
}
