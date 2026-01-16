<?php

//イベント申請確認メール機能
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EventApplicationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $url;
    public $event_name;

    /*コンストラクタでURLとイベント名を受け取る*/
    public function __construct($url, $event_name)
    {
        $this->url = $url;
        $this->event_name = $event_name;
    }

    /* メールを構築*/
    public function build()
    {
        return $this->subject('【Loveりべつ】イベント掲載申請を完了させてください')
                    ->view('emails.event_confirmation'); 
    }
}