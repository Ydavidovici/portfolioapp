<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return User::with('roles', 'projects', 'calendarEntries')->get();
    }

    public function store(UserRequest $request)
    {
        $user = User::create($request->validated());
        // You can assign roles here if needed
        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return response()->json($user->load('roles', 'projects', 'calendarEntries'));
    }

    public function update(UserRequest $request, User $user)
    {
        $user->update($request->validated());
        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }
}
