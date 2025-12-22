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
        $events = Event::where('approval_status_id', 0)
                       ->orderBy('created_at', 'desc')
                       ->get();

        $events = $events->map(function ($event) {
            $event->image_url = $event->image_path ? asset($event->image_path) : null;
            return $event;
        });

        return response()->json($events);
    }

    // 承認済みイベント一覧
    public function getApprovedEvents(Request $request)
    {
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
        $request->validate([
            'status' => 'required|string|in:approved,rejected',
        ]);

        $event = Event::findOrFail($id);
        $event->approval_status_id = $request->status === 'approved' ? 1 : 2;
        $event->rejection_reason = $request->status === 'rejected'
            ? $request->input('reason', '管理者による却下')
            : null;
        $event->save();

        return response()->json(['message' => 'ステータス更新完了']);
    }
}