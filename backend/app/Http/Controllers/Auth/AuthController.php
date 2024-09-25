<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\ChangePasswordRequest;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Apply middleware to protect certain actions.
     */
    public function __construct()
    {
        // Apply the 'auth:sanctum' middleware to all methods except 'register', 'login',
        // 'sendResetLinkEmail', 'resetPassword', 'verifyEmail', 'resendVerificationEmail'
        $this->middleware('auth:sanctum')->except([
            'register', 'login', 'sendResetLinkEmail', 'resetPassword', 'verifyEmail', 'resendVerificationEmail'
        ]);
    }

    /**
     * Register a new user with the specified role.
     */
    public function register(RegisterRequest $request)
    {
        Log::info('Register method called.');

        // Get the role from the request or default to 'client'
        $roleName = $request->input('role', 'client');

        // Only admins can assign 'admin' or 'developer' roles
        if (in_array($roleName, ['admin', 'developer'])) {
            // Utilize Gate for authorization
            Gate::authorize('perform-crud-operations');

            // Log authenticated user details
            $authenticatedUser = $request->user();
            Log::info('Authenticated User:', [
                'id' => $authenticatedUser ? $authenticatedUser->id : null,
                'roles' => $authenticatedUser ? $authenticatedUser->roles->pluck('name') : null,
            ]);
        }

        // Create user
        $user = User::create([
            'username' => $request->username,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign role
        $role = Role::where('name', $roleName)->first();
        if (!$role) {
            // If role does not exist, default to 'client'
            $role = Role::where('name', 'client')->first();
        }
        $user->roles()->attach($role);

        Log::info('User registered with roles:', [
            'user_id' => $user->id,
            'roles' => $user->roles->pluck('name'),
        ]);

        // Send email verification notification
        $user->sendEmailVerificationNotification();

        // Return response
        return response()->json([
            'message' => 'Registration successful. Please check your email to verify your account.',
        ], 201);
    }

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

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return response
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ]);
    }

    /**
     * Logout a user (invalidate the token).
     */
    public function logout(Request $request)
    {
        // Revoke the token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out.',
        ]);
    }

    /**
     * Send a reset link to the given user.
     */
    public function sendResetLinkEmail(ForgotPasswordRequest $request)
    {
        // Throttle password reset requests
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Reset link sent to your email.']);
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }

    /**
     * Reset the given user's password.
     */
    public function resetPassword(ResetPasswordRequest $request)
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                ])->save();

                // Revoke all tokens
                $user->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password has been reset.']);
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }

    /**
     * Change the password of the authenticated user.
     */
    public function changePassword(ChangePasswordRequest $request)
    {
        $user = $request->user();

        // Check current password
        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        // Update password
        $user->password = Hash::make($request->password);
        $user->save();

        // Optionally, revoke all tokens
        // $user->tokens()->delete();

        return response()->json(['message' => 'Password changed successfully.']);
    }

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

        // Create token upon verification
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Email verified successfully.',
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ]);
    }

    /**
     * Resend the email verification link.
     */
    public function resendVerificationEmail(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification link resent.']);
    }

    /**
     * Generate a throttle key for rate limiting.
     */
    protected function throttleKey(Request $request)
    {
        return Str::lower($request->input('email')) . '|' . $request->ip();
    }
}
