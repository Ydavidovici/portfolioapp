<?php

namespace App\Mail;

use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewMessageNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    public function build()
    {
        $mail = $this->subject('New Message Received')
            ->view('emails.new_message')
            ->with([
                'messageContent' => $this->message->content,
                'senderName' => $this->message->sender->username,
            ]);

        // Attach file if present
        if ($this->message->file_path) {
            $mail->attachFromStorageDisk('public', $this->message->file_path, $this->message->file_name);
        }

        return $mail;
    }
}
