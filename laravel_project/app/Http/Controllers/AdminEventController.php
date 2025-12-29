<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminEventController extends Controller
{
    // 承認待ちイベント一覧
    public function getPendingEvents(Request $request)
    {
        // ★ 管理者チェック
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $events = Event::whereIn('approval_status_id', [0, 3])
                    ->orderBy('created_at', 'desc')
                    ->get();

        $events = $events->map(function ($event) {
            $event->image_url = $event->image_path ? asset($event->image_path) : null;
            $event->is_resubmitted = ($event->approval_status_id == 3);
            return $event;
        });

        return response()->json($events);
    }

    // 承認済みイベント一覧
    public function getApprovedEvents(Request $request)
    {
        // ★ 管理者チェック
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $yearMonth = $request->query('year_month');
        $query = Event::where('approval_status_id', 1)->orderBy('start_date', 'asc');

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

    // ステータス更新
    public function updateEventStatus(Request $request, $id)
    {
        // ★ 管理者チェック
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'status' => 'required|string|in:approved,rejected',
        ]);

        $event = Event::findOrFail($id);
        $event->approval_status_id = $request->status === 'approved' ? 1 : 2;
        $event->rejection_reason = $request->status === 'rejected'
            ? $request->input('reason', '管理者による却下')
            : null;
        $event->save();

        return response()->json([
            'message' => 'ステータスを更新しました',
            'current_status' => $event->approval_status_id
        ]);
    }

    // イベント詳細取得
    public function show($id)
    {
        // ★ 管理者チェック
        if (request()->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $event = Event::find($id);

        if (!$event) {
            return response()->json(['message' => 'イベントが見つかりません'], 404);
        }

        return response()->json($event);
    }

    // イベント内容の更新保存
    public function update(Request $request, $id)
    {
        // ★ 管理者チェック
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $event->fill($request->all());

        // 再申請扱いにする
        $event->approval_status_id = 3;

        $event->save();

        return response()->json([
            'message' => 'イベント情報を更新（再申請）しました',
            'event' => $event
        ]);
    }
}

