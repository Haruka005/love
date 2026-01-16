<?php

//パスワード再設定メール機能
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $resetUrl; //React側の再設定画面へのURL

    //コンストラクタでURLを受け取る
    public function __construct($resetUrl)
    {
        $this->resetUrl = $resetUrl;
    }

    //メールの件名を設定
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '【Loveりべつ】パスワード再設定のご案内',
        );
    }

    //メールの本文を指定
    public function content(): Content
    {
        return new Content(
            view: 'emails.password_reset',
        );
    }
}