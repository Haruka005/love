<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminEventController extends Controller
{
    /**
     * 承認待ちイベント一覧 (status: 0)
     */
    public function getPendingEvents(Request $request)
    {
        // status 0 (新規申請) と 3 (再申請) の両方を取得
        $events = Event::whereIn('approval_status_id', [0, 3])
                    ->orderBy('created_at', 'desc')
                    ->get();

        $events = $events->map(function ($event) {
            $event->image_url = $event->image_path ? asset($event->image_path) : null;
            // フロントエンドで判定しやすいようフラグを追加しても良い
            $event->is_resubmitted = ($event->approval_status_id == 3);
            return $event;
    });

    return response()->json($events);
    }

    /**
     * 承認済みイベント一覧 (status: 1) および 非公開 (status: 9)
     */
    public function getApprovedEvents(Request $request)
    {
        $yearMonth = $request->query('year_month');
        $status = $request->query('status', 1);

        $query = Event::where('approval_status_id', $status)->orderBy('start_date', 'asc');

        if ($yearMonth) {
            try {
                [$year, $month] = explode('-', $yearMonth);
                $query->whereYear('start_date', $year)->whereMonth('start_date', $month);
            } catch (\Exception $e) {
                Log::warning("不正な year_month: " . $yearMonth);
            }
        }

        $events = $query->get();
        $events = $events->map(function ($event) {
            $event->image_url = $event->image_path ? asset($event->image_path) : null;
            return $event;
        });

        return response()->json($events);
    }

    /**
     * ステータス更新（承認・却下・非公開）
     */
    public function updateEventStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required',
        ]);

        $event = Event::findOrFail($id);
        $inputStatus = $request->input('status');

        if ($inputStatus === 'approved') {
            $event->approval_status_id = 1;
        } elseif ($inputStatus === 'rejected') {
            $event->approval_status_id = 2;
        } else {
            $event->approval_status_id = (int)$inputStatus;
        }

        $event->rejection_reason = $request->input('reason', '管理者によるステータス更新');
        $event->save();

        return response()->json([
            'message' => 'ステータスを更新しました',
            'current_status' => $event->approval_status_id
        ]);
    }

    /**
     * 【追加】特定のイベント詳細を取得 (編集画面の初期値用)
     */
    public function show($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['message' => 'イベントが見つかりません'], 404);
        }

        return response()->json($event);
    }

 /**
 * 【追加】イベント内容の更新保存
 */
public function update(Request $request, $id)
{
    $event = Event::findOrFail($id);

    // バリデーション
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'start_date' => 'nullable|date',
        'end_date' => 'nullable|date',
    ]);

    // 1. 送られてきたデータを更新
    $event->fill($request->all());

    // 2. ここが重要！再申請時はステータスを強制的に「3 (再申請中)」に書き換える
    // 管理者が編集した際も再度「未承認」状態に戻すための処理です
    $event->approval_status_id = 3;

    // 3. 保存
    $event->save();

    return response()->json([
        'message' => 'イベント情報を更新（再申請）しました',
        'event' => $event
    ]);
}
}