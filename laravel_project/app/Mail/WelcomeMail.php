<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;   //ユーザ情報を受け取る変数
    public $url;


    //コンストラクタでユーザ情報を受け取る
    public function __construct($user, $url)
    {
        $this->user = $user;
        $this->url = $url;
    }

    //メールの件名を設定
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'ご登録ありがとうございます！',
        );
    }

    /**
     * Get the message content definition.
     */

    //メールの見た目（ファイル）を指定
    //mailフォルダのwelcomを指定
    public function content(): Content
    {
        return new Content(
            view: 'emails.welcome',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */

    //添付ファイル
    public function attachments(): array
    {
        return [];
    }
}
