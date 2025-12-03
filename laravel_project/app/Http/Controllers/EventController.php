<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event; //Eventモデル使う
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
        $events = Event::where(function($query) use ($startOfMonth, $endOfMonth) {
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

    //今月のイベントを取得する
   public function getUpComingEvent()
{
    $now = Carbon::now();
    $year = $now->year;
    $month = $now->month;

    // 今月のイベントを取得
    $startOfMonth = Carbon::create($year, $month, 1)->startOfMonth();
    $endOfMonth = Carbon::create($year, $month, 1)->endOfMonth();

    $events = Event::where(function($query) use ($startOfMonth, $endOfMonth) {
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

    return response()->json($events); // ← ここで配列だけを返す
    }


    public function show($id)
    {
        try {
            // IDに基づいてイベントを取得。見つからなければ例外を投げる (404 Not Found)
            $event = Event::findOrFail($id);
            
            // 成功したイベントデータをJSONで返す
            return response()->json($event);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // イベントがデータベースに見つからなかった場合の処理
            return response()->json(['error' => '指定されたイベントが見つかりません。'], 404);
            
        } catch (\Exception $e) {
            // その他の予期せぬエラー (念のため500エラーを返すロジック)
            // サーバーのログで詳細なエラー原因を確認することを推奨します
            // Log::error("イベント詳細取得エラー: " . $e->getMessage()); 
            return response()->json(['error' => 'サーバー内部エラーが発生しました。'], 500);
        }
    }

    //ログインしたユーザーのイベント登録履歴表示
    public function index(Request $request)
    {
    try {
        // ログインユーザーのIDを取得
        $userId = $request->user()->id;

        // ユーザーが申請したイベント一覧を取得
        $events = Event::where('user_id', $userId)
            ->orderBy('start_date', 'asc')
            ->get([
                'id',
                'name',
                'catchphrase',
                'start_date',
                'end_date',
                'description',
                'location',
                'url',
                'organizer',
                'notes',
                'image_url'
            ]);

        return response()->json($events);

    } catch (\Exception $e) {
        return response()->json(['error' => 'イベント一覧の取得に失敗しました'], 500);
    }
}
}
