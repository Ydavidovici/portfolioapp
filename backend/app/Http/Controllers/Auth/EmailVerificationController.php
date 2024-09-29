<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;

class EmailVerificationController extends Controller
{
    /**
     * Verify the user's email address.
     */
    public function verifyEmail(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Invalid verification link.'], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // Generate a new API token upon verification
        $rawToken = Str::random(60);
        $user->api_token = hash('sha256', $rawToken);
        $user->save();

        return response()->json([
            'message'      => 'Email verified successfully.',
            'access_token' => $rawToken,
            'token_type'   => 'Bearer',
        ]);
    }
}
