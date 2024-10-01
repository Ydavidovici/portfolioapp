<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;

class AuthenticateApiToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\JsonResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Retrieve the Bearer token from the request
        $token = $request->bearerToken();

        // Check if the token is present
        if (!$token) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Validate the token by checking if a user with this token exists
        $user = User::where('api_token', hash('sha256', $token))->first();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Set the authenticated user in the request
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        return $next($request);
    }
}
