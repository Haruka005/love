<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminLoginVerifyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $code;

    public function __construct($code)
    {
        // 6桁の認証コードを受け取る
        $this->code = $code;
    }

    public function build()
    {
        return $this->subject('【管理者】ログイン認証コードのご案内')
                    ->view('emails.admin_login_verify'); // 後ほど作るHTMLテンプレート
    }
}

