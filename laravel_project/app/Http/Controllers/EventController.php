<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\Event;
use App\Models\User;
use Carbon\Carbon;

class EventController extends Controller
{
    /**
     * カレンダー表示用：指定された年月の承認済みイベントを取得
     */
    public function getByMonth($year, $month)
    {
        $startOfMonth = Carbon::create($year, $month, 1)->startOfMonth();
        $endOfMonth = Carbon::create($year, $month, 1)->endOfMonth();

        $events = Event::where('approval_status_id', 1) 
        ->where(function ($query) use ($startOfMonth, $endOfMonth) {
            $query->whereBetween('start_date', [$startOfMonth, $endOfMonth])
                    ->orWhereBetween('end_date', [$startOfMonth, $endOfMonth]);
        })
        ->orderBy('start_date', 'asc')
        ->get([
            'id', 'name', 'catchphrase', 'start_date', 'end_date', 'location', 'image_path'
        ]);

        return response()->json($events);
    }

    /**
     * トップページ用：今月の承認済みイベントを取得
     */
    public function getUpComingEvent()
    {
        try {
            $startOfMonth = Carbon::now()->startOfMonth();
            $endOfMonth = Carbon::now()->endOfMonth();

            $events = Event::where('approval_status_id', 1) 
                ->where(function ($query) use ($startOfMonth, $endOfMonth) {
                    $query->whereBetween('start_date', [$startOfMonth, $endOfMonth])
                        ->orWhereBetween('end_date', [$startOfMonth, $endOfMonth]);
                })
                ->orderBy('start_date', 'asc')
                ->get([
                    'id', 'name', 'catchphrase', 'start_date', 'end_date', 'location', 'image_path' 
                ]);
            
            return response()->json($events); 

        } catch (\Exception $e) {
            Log::error("イベント取得エラー: " . $e->getMessage());
            return response()->json(['error' => 'イベントデータの取得中にサーバーエラーが発生しました'], 500);
        }
    }

    /**
     * 詳細・編集画面用：イベント情報を取得
     * 修正ポイント：where条件を外し、拒否(2)や未承認(0)のデータも取得可能にしました
     */
    public function show($id)
    {
        try {
            // IDのみで検索することで、どのステータスのイベントも編集画面に読み込めます
            $event = Event::findOrFail($id);
            return response()->json($event);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => '指定されたイベントは見つかりません。'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'サーバー内部エラーが発生しました。'], 500);
        }
    }

    /**
     * マイページ用：ログインユーザーの全イベント履歴を表示
     */
    public function index(Request $request)
    {
        try {
            $userId = $request->user()->id;

            $events = Event::where('user_id', $userId)
                ->orderBy('start_date', 'asc')
                ->get([
                    'id', 'name', 'catchphrase', 'start_date', 'end_date',
                    'description', 'location', 'url', 'organizer', 'notes',
                    'image_path', 'approval_status_id', 'rejection_reason', 'is_free_participation'
                ]);

            return response()->json($events);
        } catch (\Exception $e) {
            return response()->json(['error' => 'イベント一覧の取得に失敗しました'], 500);
        }
    }

    /**
     * 新規登録
     */
    public function storeEventData(Request $request)
    {
        $userId = $request->input('user_id');
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['error' => 'ユーザーが見つかりません'], 404);
        }

        // 画像保存処理
        $imagePath = null;
        if ($request->hasFile('image')) {
            $eventFolderPath = "user_images/{$user->id}/events";
            $imagePath = $request->file('image')->store($eventFolderPath, 'public');
        }

        $event = new Event();
        $event->user_id = $user->id;
        $event->name = $request->input('name');
        $event->catchphrase = $request->input('catchphrase');
        $event->description = $request->input('description');
        $event->start_date = $request->input('start_date');
        $event->end_date = $request->input('end_date');
        $event->location = $request->input('location');
        $event->url = $request->input('url');
        $event->notes = $request->input('notes');
        $event->organizer = $request->input('organizer');
        $event->is_free_participation = (int) $request->input('is_free_participation');
        $event->is_open_enrollment = 1;
        $event->approval_status_id = 0; // 新規は「未承認」から開始

        if ($imagePath) {
            $event->image_path = Storage::url($imagePath);
        }

        $event->save();
        return response()->json(['message' => 'イベント情報を保存しました']);
    }

    /**
 * イベント更新（再申請対応）
 */
public function update(Request $request, $id)
{
    try {
        $event = Event::findOrFail($id);

        // 基本情報の更新
        $fields = ['name', 'catchphrase', 'description', 'start_date', 'end_date', 'location', 'url', 'notes', 'organizer'];
        foreach ($fields as $field) {
            $event->$field = $request->input($field, $event->$field);
        }
        $event->is_free_participation = (int) $request->input('is_free_participation', $event->is_free_participation);

        // --- ここから修正 ---
        if ($request->has('approval_status_id')) {
            // 管理者画面からの更新（管理者ツールなど）
            $event->approval_status_id = (int) $request->input('approval_status_id');
        } else {
            // 一般ユーザーが編集保存した場合は、問答無用で「再申請（3）」にする
            $event->approval_status_id = 3;
        }

        // 再申請時は、次に管理者が「なぜ却下されたか」を確認できるよう、
        // rejection_reason（拒否理由）は「消さずに残しておく」のが一般的です。
        // （Admin側で修正後の内容と比較しやすいため）
        // もし消したい場合は、$event->rejection_reason = null; をここに入れてください。
        // --- ここまで修正 ---

        // 画像の差し替え
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store("user_images/{$event->user_id}/events", 'public');
            $event->image_path = Storage::url($imagePath);
        }

        $event->save();
        return response()->json(['message' => 'イベント情報を更新しました', 'event' => $event]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => '指定されたイベントが見つかりません'], 404);
        } catch (\Exception $e) {
            Log::error("イベント更新失敗: " . $e->getMessage());
            return response()->json(['error' => 'イベント更新に失敗しました'], 500);
        }
}

    /**
     * イベント削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $event = Event::findOrFail($id);

            if ($event->user_id !== $request->user()->id) {
                return response()->json(['error' => '権限がありません'], 403);
            }

            $event->delete();
            return response()->json(['message' => 'イベントを削除しました']);

        } catch (\Exception $e) {
            return response()->json(['error' => 'イベント削除に失敗しました'], 500);
        }
    }
}