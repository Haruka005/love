<?php

namespace App\Mail;

use App\Models\Restaurant;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RestaurantApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    
    public $restaurant;
    public $url;

   
    public function __construct(Restaurant $restaurant, $url)
    {
        $this->restaurant = $restaurant;
        $this->url = $url;
    }

    public function build()
    {
        return $this->subject('【Loveりべつ】店舗情報の掲載が承認されました')
                    ->view('emails.restaurant_approved')
                    ->with([
                        'restaurant_name' => $this->restaurant->name,
                        'url' => $this->url,
                    ]);
    }
}