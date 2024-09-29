<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class LogoutController extends Controller
{
    /**
     * Logout a user (invalidate the token).
     */
    public function logout(Request $request)
    {
        // Invalidate the user's API token
        $user = $request->user();
        $user->api_token = null;
        $user->save();

        return response()->json([
            'message' => 'Successfully logged out.',
        ]);
    }
}
