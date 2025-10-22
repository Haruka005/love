<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storange;
use Illuminate\Support\Facades\Auth;

class EventImageController extends Controller
{
    /**イベント画像をアップロードする処理 */
    /*リアクトから送られてきた画像を、ユーザー専用フォルダに保存します*/

    public function uploadEventImage(Request $request)
    {
        //ログイン中のユーザー情報を取得
        $user = Auth::user();

        //ユーザーがまだ画像フォルダを持っていない場合は作成する
        if(!$user -> has_image_folder){
            //ファルダパスを作成
            $folderPath = 'public/user_images' . $user->id;

            //LaravelのStorage機能を使ってファルダを作成
            Storage::makeDirectory($folderPath);

            //ユーザーの画像ファルダ作成フラグをtrueに変更＝作成済みの時
            $user -> has_image_folder = true;

            //フラグの変更をデータベースに保存
            $user ->save();
        }

        //画像ファイルをユーザー専用ファルダの「event」サブフォルダに保存
        $path = $request->file('image')->store('public/user_images/{$user->id}/events');

        //保存した画像のURLを返す（リアクト側で表示できるように）
        return response() ->json([
            'path'=>Storage::url($path) 
            //例　/storage/users_images/3/events/xxx.jpg
        ]);
    }
}

