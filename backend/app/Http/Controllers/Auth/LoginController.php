<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;

class LoginController extends Controller
{
    /**
     * Login a user and create a token.
     */
    public function login(LoginRequest $request)
    {
        // Throttle login attempts
        if (RateLimiter::tooManyAttempts($this->throttleKey($request), 5)) {
            return response()->json([
                'message' => 'Too many login attempts. Please try again later.',
            ], 429);
        }

        // Find user by email
        $user = User::where('email', $request->email)->first();

        // Check credentials
        if (!$user || !Hash::check($request->password, $user->password)) {
            RateLimiter::hit($this->throttleKey($request));

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Clear login attempts
        RateLimiter::clear($this->throttleKey($request));

        // Check if email is verified
        if (!$user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Please verify your email address.'], 403);
        }

        // Generate API token
        $rawToken = Str::random(60);
        $user->api_token = hash('sha256', $rawToken);
        $user->save();

        return response()->json([
            'access_token' => $rawToken,
            'token_type'   => 'Bearer',
        ]);
    }

    /**
     * Generate a throttle key for rate limiting.
     */
    protected function throttleKey(Request $request)
    {
        return Str::lower($request->input('email')) . '|' . $request->ip();
    }
}
