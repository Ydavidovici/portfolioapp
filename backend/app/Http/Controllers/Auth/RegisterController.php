<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerifyEmail;
use App\Http\Controllers\Controller;

class RegisterController extends Controller
{
    /**
     * Register a new user with the specified role.
     */
    public function register(RegisterRequest $request)
    {
        \Log::info('Register method called.');

        // Default role to 'client' if not specified
        $roleName = $request->input('role', 'client');
        \Log::info("Requested role: {$roleName}");

        // Only admins can assign 'admin' or 'developer' roles
        if (in_array($roleName, ['admin', 'developer'])) {
            \Log::info("Authorizing user ID: {$request->user()->id} for role assignment: {$roleName}");
            Gate::authorize('perform-crud-operations');
        }

        // Find the role or default to 'client'
        $role = Role::where('name', $roleName)->first();

        if (!$role) {
            // If role does not exist, return error
            \Log::warning("Role '{$roleName}' not found. Defaulting to 'client'.");
            $role = Role::where('name', 'client')->first();
        }

        // Create the user
        $user = User::create([
            'username' => $request->username,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign the role
        $user->roles()->attach($role);

        \Log::info('User registered with roles:', [
            'user_id' => $user->id,
            'roles'   => $user->roles->pluck('name'),
        ]);

        // Generate API token
        $rawToken = Str::random(60);
        $user->api_token = hash('sha256', $rawToken);
        $user->save();

        // Send email verification
        Mail::to($user->email)->send(new VerifyEmail($user));

        return response()->json([
            'message'      => 'Registration successful. Please check your email to verify your account.',
            'access_token' => $rawToken,
            'token_type'   => 'Bearer',
        ], 201);
    }
}
