<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Message;

class NewMessageNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $message;

    /**
     * Create a new message instance.
     *
     * @param  \App\Models\Message  $message
     * @return void
     */
    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.new_message')
        ->with([
            'content' => $this->message->content,
            'sender' => $this->message->sender->username,
            'receiver' => $this->message->receiver->username,
            'file_name' => $this->message->file_name ?? null, // Pass file_name to the view if available
        ]);
    }
}
