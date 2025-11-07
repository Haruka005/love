<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Models\Event;
use App\Models\User;
use App\Models\EventImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventImageController extends Controller
{
    // イベント情報をデータフォルダ作成し保存する処理（画像はeventへ、情報はusers）
    public function storeEventData(Request $request)
    {
        Log::info('storeEventData に到達しました', ['user_id' => $request->input('user_id')]);

        // ユーザー情報を取得する
        $userId = $request->input('user_id');
        $user = User::find($userId);

        // ユーザーがいなかったらエラー返す
        if (!$user) {
            return response()->json(['error' => 'ユーザーが見つかりません'], 404);
        }

        // 画像フォルダがまだなかったら作るよ（初回申請時など）
        $folderPath = "user_images/{$user->id}";
        if (!$user->has_image_folder) {
            $created = Storage::disk('public')->makeDirectory($folderPath);
            Log::info('ユーザー画像フォルダ作成（storeEventData）', ['path' => $folderPath, 'created' => $created]);

            if ($created) {
                $user->has_image_folder = true;
                $user->save();
                Log::info('has_image_folder フラグを true に更新しました');
            }
        }

        // 画像が送られてきた場合だけ保存する
        $imagePath = null;
        if ($request->hasFile('image')) {
            $eventFolderPath = "user_images/{$user->id}/events";

            // イベント用フォルダがなかったら作る
            if (!Storage::disk('public')->exists($eventFolderPath)) {
                Storage::disk('public')->makeDirectory($eventFolderPath);
                Log::info('イベントフォルダ作成', ['path' => $eventFolderPath]);
            }

            // 画像を保存する
            $imagePath = $request->file('image')->store($eventFolderPath, 'public');
        }

        // イベント情報をDBに保存
        $event = new EventImage();
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
        $event->is_open_enrollment = 1; // 公開申請にしておく
        $event->approval_status_id = 0; // 初期状態は未承認
        $event->rejection_reason = null;
       



        // 画像があればパスも保存するよ
        if ($imagePath) {
            $event->image_path = Storage::url($imagePath); // /storage/... の形式になるよ
        }

        $event->save(); // DBに保存！

        return response()->json(['message' => 'イベント情報を保存しました']);
    }
};
