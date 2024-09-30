<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerifyEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The user instance.
     *
     * @var \App\Models\User
     */
    public $user;

    /**
     * The verification URL.
     *
     * @var string
     */
    public $verificationUrl;

    /**
     * Create a new message instance.
     *
     * @param \App\Models\User $user
     */
    public function __construct(User $user)
    {
        $this->user = $user;
        $this->verificationUrl = $this->generateVerificationUrl($user);
    }

    /**
     * Generate the email verification URL.
     *
     * @param \App\Models\User $user
     * @return string
     */
    protected function generateVerificationUrl(User $user)
    {
        return url("/email/verify/{$user->id}/" . sha1($user->getEmailForVerification()));
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Verify Your Email Address')
            ->markdown('emails.verify-email')
            ->with([
                'username' => $this->user->username,
                'verificationUrl' => $this->verificationUrl,
            ]);
    }
}
