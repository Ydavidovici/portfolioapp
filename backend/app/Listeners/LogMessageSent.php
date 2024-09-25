<?php

namespace App\Listeners;

use App\Events\MessageSent;
use Illuminate\Support\Facades\Log;

class LogMessageSent
{
    /**
     * Handle the event.
     *
     * @param  \App\Events\MessageSent  $event
     * @return void
     */
    public function handle(MessageSent $event)
    {
        Log::info('MessageSent event handled:', [
            'message_id' => $event->message->id,
            'sender_id' => $event->message->sender_id,
            'receiver_id' => $event->message->receiver_id,
            'content' => $event->message->content,
        ]);
    }
}
