<?php

//店舗再申請確認メール機能
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RestaurantReappliedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $restaurantName;
    public $confirmationUrl;

    public function __construct($restaurantName, $confirmationUrl)
    {
        $this->restaurantName = $restaurantName;
        $this->confirmationUrl = $confirmationUrl;
    }

    public function build()
    {
        return $this->subject('【LOVEりべつ】飲食店掲載申請を完了させてください')
                    ->view('emails.restaurant_comfirmation') 
                    ->with([
                        'url' => $this->confirmationUrl,
                    ]);
    }
}