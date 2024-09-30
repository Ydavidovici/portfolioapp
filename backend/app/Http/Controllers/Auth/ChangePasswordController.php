<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ChangePasswordController extends Controller
{
    /**
     * Handle an authenticated user's password change request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function change(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|confirmed|min:8',
        ]);

        $user = $request->user();

        // Check if the provided current password matches the user's password
        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        // Update the user's password and invalidate the API token
        $user->forceFill([
            'password'  => Hash::make($request->password),
            'api_token' => null, // Invalidate existing tokens
        ])->save();

        return response()->json([
            'message' => 'Password changed successfully.',
        ], 200);
    }
}
