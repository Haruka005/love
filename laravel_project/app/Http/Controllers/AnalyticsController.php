<?php
//利用状況分析画面
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function getSummary()
    {
        try {
            // 管理者(role=1)を除外したベースクエリ
            $baseQuery = DB::table('t_access_logs')
                ->leftJoin('users', 't_access_logs.user_id', '=', 'users.id')
                ->where(function($query) {
                    $query->where('users.role', '!=', 1)->orWhereNull('t_access_logs.user_id');
                });

            // 基本KPI
            $todayPv = (clone $baseQuery)->whereDate('t_access_logs.accessed_at', Carbon::today())->count();
            $todayUu = (clone $baseQuery)->whereDate('t_access_logs.accessed_at', Carbon::today())->distinct('t_access_logs.ip_address')->count('t_access_logs.ip_address');
            $totalPv = (clone $baseQuery)->count();

            // 1. 飲食店PVランキング
            $restaurants = DB::table('m_restaurants as r')
                ->join('t_access_logs as l', 'l.url', 'like', DB::raw("CONCAT('%/restaurants/', r.id)"))
                ->leftJoin('users as u', 'l.user_id', '=', 'u.id')
                ->where(function($q) { $q->where('u.role', '!=', 1)->orWhereNull('l.user_id'); })
                ->select('r.name', DB::raw('(SELECT name FROM m_areas WHERE id = r.area_id) as area'), DB::raw('COUNT(l.id) as count'))
                ->groupBy('r.id', 'r.name', 'r.area_id')
                ->orderBy('count', 'desc')->limit(10)->get();

            // 2. イベントPVランキング
            $events = DB::table('test_events as e')
                ->join('t_access_logs as l', 'l.url', 'like', DB::raw("CONCAT('%/events/', e.id)"))
                ->leftJoin('users as u', 'l.user_id', '=', 'u.id')
                ->where(function($q) { $q->where('u.role', '!=', 1)->orWhereNull('l.user_id'); })
                ->select('e.name', 'e.location', DB::raw('COUNT(l.id) as count'))
                ->groupBy('e.id', 'e.name', 'e.location')
                ->orderBy('count', 'desc')->limit(10)->get();

            // 3. 直近10件の注目度
            $latestEvents = DB::table('test_events as e')
                ->leftJoin('t_access_logs as l', 'l.url', 'like', DB::raw("CONCAT('%/events/', e.id)"))
                ->select('e.id', 'e.name', 'e.start_date as event_date', 'e.location', DB::raw('COUNT(l.id) as pv_count'))
                ->groupBy('e.id', 'e.name', 'e.start_date', 'e.location')
                ->orderBy('pv_count', 'desc')->limit(10)->get();

            // 4. リアルタイムログ
            $recentLogs = (clone $baseQuery)
                ->select('t_access_logs.url', 't_access_logs.ip_address', 't_access_logs.accessed_at', 'users.name as user_name')
                ->orderBy('t_access_logs.accessed_at', 'desc')->limit(50)->get();

            // 5. 【重要】24時間詳細分析 (直近7日間)
            $hourlyData = (clone $baseQuery)
                ->where('t_access_logs.accessed_at', '>=', now()->subDays(7))
                ->select(DB::raw('HOUR(t_access_logs.accessed_at) as hour'), DB::raw('COUNT(*) as count'))
                ->groupBy('hour')->get()->pluck('count', 'hour')->all();

            $hourlyStats = [];
            for ($i = 0; $i < 24; $i++) {
                $hourlyStats[] = ['hour' => $i, 'count' => $hourlyData[$i] ?? 0];
            }

            return response()->json([
                'success' => true,
                'today_pv' => $todayPv,
                'today_uu' => $todayUu,
                'total_pv' => $totalPv,
                'restaurants' => $restaurants,
                'events' => $events,
                'latest_events' => $latestEvents,
                'recent_logs' => $recentLogs,
                'hourly_stats' => $hourlyStats,
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * アクセスログを保存するメソッドを追加
     */
    public function storeAccess(Request $request)
    {
        try {
            // バリデーション
            $request->validate([
                'url' => 'required|string',
                'user_id' => 'nullable|integer',
            ]);

            // ログの保存処理
            DB::table('t_access_logs')->insert([
                'url' => $request->url,
                'user_id' => $request->user_id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'accessed_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            // ログ保存の失敗で画面が止まらないよう、エラーを返さずログにのみ記録
            \Log::error('Access Log Save Failed: ' . $e->getMessage());
            return response()->json(['success' => false], 200); 
        }
    }
}