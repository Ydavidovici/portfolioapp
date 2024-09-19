<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use App\Models\Message;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        // Fetch a list of all users for administrative oversight
        $users = User::with('roles')->get();

        // Fetch all projects for administrative purposes
        $projects = Project::with('client', 'tasks', 'feedback')->get();

        // Fetch the latest messages for the admin
        $messages = Message::where('receiver_id', $request->user()->id)->orderBy('created_at', 'desc')->take(5)->get();

        return response()->json([
            'message' => 'Welcome to the Admin Dashboard',
            'users' => $users,
            'projects' => $projects,
            'messages' => $messages,
        ]);
    }
}
