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
    //GetEvennts.jsxのカードに表示させるカラムをここで指定してる
    // 指定された年月のイベントを取得
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
            'id',
            'name',
            'catchphrase',
            'start_date',
            'end_date',
            'location',
        ]);

        return response()->json($events);
    }
    // 今月のイベントを取得
    public function getUpComingEvent()
    {
        
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        $events = Event::where('approval_status_id', 1) 
        ->where(function ($query) use ($startOfMonth, $endOfMonth) {
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
            'location'
        ]);

        return response()->json($events);
    }

    // イベント詳細取得
    public function show($id)
    {
        try {
            $event = Event::findOrFail($id);
            return response()->json($event);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => '指定されたイベントが見つかりません。'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'サーバー内部エラーが発生しました。'], 500);
        }
    }

    // ログインユーザーのイベント登録履歴表示
    public function index(Request $request)
    {
        \Log::info('index開始', ['user' => $request->user()]);
        try {
            $userId = $request->user()->id;

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
                    'image_path' ,
                    'approval_status_id',   // ← 承認状態（0=未承認, 1=承認済, 2=拒否）
                    'rejection_reason'      // ← 拒否理由（管理者メッセージ）

                ]);

            return response()->json($events);
        } catch (\Exception $e) {
            return response()->json(['error' => 'イベント一覧の取得に失敗しました'], 500);
        }
    }

    // イベント情報を保存（画像含む）
    public function storeEventData(Request $request)
    {
        Log::info('storeEventData に到達しました', ['user_id' => $request->input('user_id')]);

        $userId = $request->input('user_id');
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['error' => 'ユーザーが見つかりません'], 404);
        }

        // ユーザー画像フォルダ作成
        $folderPath = "user_images/{$user->id}";
        if (!$user->has_image_folder) {
            $created = Storage::disk('public')->makeDirectory($folderPath);
            if ($created) {
                $user->has_image_folder = true;
                $user->save();
            }
        }

        // 画像保存
        $imagePath = null;
        if ($request->hasFile('image')) {
            $eventFolderPath = "user_images/{$user->id}/events";
            if (!Storage::disk('public')->exists($eventFolderPath)) {
                Storage::disk('public')->makeDirectory($eventFolderPath);
            }
            $imagePath = $request->file('image')->store($eventFolderPath, 'public');
        }

        // イベント情報保存
        $event = new Event(); // ← EventImage ではなく Event
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
        $event->is_free_participation = $request->input('is_free_participation') === '自由参加' ? 1 : 0;
        $event->is_open_enrollment = 1;
        $event->approval_status_id = 0;
        $event->rejection_reason = null;

        if ($imagePath) {
            $event->image_path = Storage::url($imagePath); // ← image_path に統一
        }

        $event->save();

        return response()->json(['message' => 'イベント情報を保存しました']);
    }

    // イベント情報を更新(編集)
    public function update(Request $request, $id)
    {
        try {
            $event = Event::findOrFail($id);

            $event->name = $request->input('name', $event->name);
            $event->catchphrase = $request->input('catchphrase', $event->catchphrase);
            $event->description = $request->input('description', $event->description);
            $event->start_date = $request->input('start_date', $event->start_date);
            $event->end_date = $request->input('end_date', $event->end_date);
            $event->location = $request->input('location', $event->location);
            $event->url = $request->input('url', $event->url);
            $event->notes = $request->input('notes', $event->notes);
            $event->organizer = $request->input('organizer', $event->organizer);
            $event->is_free_participation = $request->input('is_free_participation', $event->is_free_participation);

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store("user_images/{$event->user_id}/events", 'public');
                $event->image_path = Storage::url($imagePath); // ← image_path に統一
            }

            $event->save();

            return response()->json(['message' => 'イベント情報を更新しました', 'event' => $event]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => '指定されたイベントが見つかりません'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'イベント更新に失敗しました'], 500);
        }
    }

    // イベント削除（DBからも削除）
    public function destroy(Request $request, $id)
    {
    try {
        $event = Event::findOrFail($id);

        // ログインユーザーのイベントか確認（セキュリティ対策）
        if ($event->user_id !== $request->user()->id) {
            return response()->json(['error' => '権限がありません'], 403);
        }

        $event->delete();

        return response()->json(['message' => 'イベントを削除しました']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => '指定されたイベントが見つかりません'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'イベント削除に失敗しました'], 500);
        }
    }
}