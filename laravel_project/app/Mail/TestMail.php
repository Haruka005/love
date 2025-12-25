<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TestMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;   //ユーザ情報を受け取る変数
    /**
     * Create a new message instance.
     */

    //コンストラクタでユーザ情報を受け取る
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Get the message envelope.
     */

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
            view: 'email.welcom',
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
