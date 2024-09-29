<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerifyEmail;
use App\Http\Controllers\Controller;

class ResendVerificationController extends Controller
{
    /**
     * Resend the email verification link.
     */
    public function resendVerificationEmail(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        // Send email verification notification
        Mail::to($user->email)->send(new VerifyEmail($user));

        return response()->json(['message' => 'Verification link resent.']);
    }
}
