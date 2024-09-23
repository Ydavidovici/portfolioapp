<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Authorization: Check if the user can manage users and roles
        if (!Gate::allows('manage-users/roles')) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $users = User::with('roles', 'projects', 'calendarEntries')->get();

        return response()->json($users);
    }

    /**
     * Store a newly created user.
     *
     * @param  \App\Http\Requests\UserRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(UserRequest $request)
    {
        // Authorization: Check if the user can manage users and roles
        if (!Gate::allows('manage-users/roles')) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $user = User::create([
            'username' => $request->username,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
        ]);

        // Assign roles if provided
        if ($request->has('roles')) {
            $user->roles()->attach($request->roles);
        }

        return response()->json($user, 201);
    }

    /**
     * Display the specified user.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(User $user)
    {
        // Authorization: Check if the user can manage users and roles
        if (!Gate::allows('manage-users/roles')) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json($user->load('roles', 'projects', 'calendarEntries'));
    }

    /**
     * Update the specified user.
     *
     * @param  \App\Http\Requests\UserRequest  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UserRequest $request, User $user)
    {
        // Authorization: Check if the user can manage users and roles
        if (!Gate::allows('manage-users/roles')) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $user->update($request->validated());

        // Update roles if provided
        if ($request->has('roles')) {
            $user->roles()->sync($request->roles);
        }

        return response()->json($user->load('roles', 'projects', 'calendarEntries'));
    }

    /**
     * Remove the specified user.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(User $user)
    {
        // Authorization: Check if the user can manage users and roles
        if (!Gate::allows('manage-users/roles')) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $user->delete();

        return response()->json(null, 204);
    }
}
