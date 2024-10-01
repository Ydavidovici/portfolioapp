<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;

class ChangePasswordController extends Controller
{
    public function change(Request $request)
    {
        // Check if the user is authenticated
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Validate the request data
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|confirmed|min:8',
        ]);

        // Check if the current password matches
        if (!Hash::check($request->input('current_password'), $request->user()->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 400);
        }

        // Update the user's password and invalidate the API token
        $request->user()->password = Hash::make($request->input('password'));
        $request->user()->api_token = null; // Invalidate the API token
        $request->user()->save();

        return response()->json(['message' => 'Password changed successfully.'], 200);
    }
}
