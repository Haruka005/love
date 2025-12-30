<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ChangeEmailMail extends Mailable
{
    use Queueable, SerializesModels;

    public $url;

    //コンストラクタでURLを受け取る
    public function __construct($url)
    {
        $this->url = $url;
    }

    //メールの内容
    public function build()
    {
        return $this->subject('【LOVEりべつ】メールアドレス変更の確認')
                    ->view('emails.change_email'); 
    }
}