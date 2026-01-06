<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\Event;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\EventApplicationMail;

class EventController extends Controller
{
    /**
     * カレンダー表示用：指定された年月の承認済みイベントを取得
     */
    public function getByMonth($year, $month)
    {
        $startOfMonth = Carbon::create($year, $month, 1)->startOfMonth();
        $endOfMonth = Carbon::create($year, $month, 1)->endOfMonth();

        $events = Event::where('approval_status_id', 2) 
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

            $events = Event::where('approval_status_id', 2) 
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

        //トークン生成
        $token = Str::random(64);

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
        $event->confirmation_token = $token;

        if ($imagePath) {
            $event->image_path = Storage::url($imagePath);
        }

        $event->save();

        //メール送信
        $link = url("/api/event-request/confirm?token={$token}");
        Mail::to($user->email)->send(new EventApplicationMail($link, $event->name));

        return response()->json(['message' => 'イベント情報を保存しました']);
    }

    //申請メールクリック後処理
    public function confirmEvent(Request $request)
    {
        $token = $request->query('token');

        //トークンでイベントを探す
        $event = Event::where('confirmation_token', $token)->first();

        if (!$event) {
            // トークンが無効な場合はエラーページへ
            return redirect('http://localhost:3000/event-registration-error');
        }

        // 4. ステータスを更新してトークンを消す
        $event->approval_status_id = 1; // 1: 管理者審査待ち（申請完了）
        $event->confirmation_token = null;
        $event->save();

        // 5. Reactの「イベント申請完了ページ」へリダイレクト
        return redirect('http://localhost:3000/event-registration-success');
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

            $statusInput = $request->input('approval_status_id');

            if ($statusInput == 3) {
                //一般ユーザーからの再申請の場合
                $event->approval_status_id = 0; //メール確認待ち
                $event->confirmation_token = Str::random(64); 
                $isReapplication = true;
            } elseif ($request->has('approval_status_id')) {
                // 管理者が承認・却下などを操作した場合
                $event->approval_status_id = (int) $statusInput;
                $isReapplication = false;
            } else {
                // それ以外の通常の更新
                $isReapplication = false;
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

            if ($isReapplication) {
                $user = User::find($event->user_id);
                if ($user) {
                    $link = url("/api/event-request/confirm?token={$event->confirmation_token}");
                    Mail::to($user->email)->send(new EventApplicationMail($link, $event->name));
                }
            }

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