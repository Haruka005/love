<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\test_events; //Eventモデル使う
use Carbon\Carbon; //日付処理簡単になるやつ使う

class EventController extends Controller
{
    //mainpageの/api/events/2025/10から呼び出される
    //指定された年月のイベントを取得する
    public function getByMonth($year,$month)
    {
        
          // 月の初日と末日をCarbonで取得
        $startOfMonth = Carbon::create($year, $month, 1)->startOfMonth();
        $endOfMonth = Carbon::create($year, $month, 1)->endOfMonth();

        // start_date または end_date がその月にかかるイベントを取得
        $events = GetEvent::where(function($query) use ($startOfMonth, $endOfMonth) {
                $query->whereBetween('start_date', [$startOfMonth, $endOfMonth])
                      ->orWhereBetween('end_date', [$startOfMonth, $endOfMonth]);
            })
            ->orderBy('start_date', 'asc')
            ->get([
                'id',
                'name',
                'catchphrase',
                'start_date',
                'end_date',
            ]);

        // JSONで返す
        return response()->json($events);
    }

    public function getUpComingEvent()
    {
        $now = Carbon::now();
        $year = $now->year;
        $month = $now->month;
        
        //今月のイベントを既存のgetByMonth()メソッドから取得
        //そこから今月のイベントに絞る
        return $this->getByMonth($year, $month);

    }
}
