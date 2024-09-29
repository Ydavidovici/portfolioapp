<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AdminDashboardController extends Controller
{
    /**
     * Apply middleware to ensure only authenticated users can access the dashboard.
     */
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Display the admin dashboard.
     */
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        // Authorization: Check if the user can access the admin dashboard
        if (!Gate::allows('access-admin-dashboard')) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        // Fetch a list of all users with their roles
        $users = User::with('roles')->get();

        // Fetch all projects with related client, tasks, and feedback
        $projects = Project::with(['client', 'tasks', 'feedback'])->get();

        // Fetch the latest 5 messages for the admin
        $messages = Message::where('receiver_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'message' => 'Welcome to the Admin Dashboard',
            'users' => $users,
            'projects' => $projects,
            'messages' => $messages,
        ]);
    }
}
