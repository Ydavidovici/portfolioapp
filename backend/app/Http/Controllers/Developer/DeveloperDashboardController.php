<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Message;
use Illuminate\Http\Request;

class DeveloperDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Fetch all tasks assigned to the developer
        $tasks = Task::where('assigned_to', $user->id)->with('project')->orderBy('due_date')->get();

        // Fetch the latest messages for the developer
        $messages = Message::where('receiver_id', $user->id)->orderBy('created_at', 'desc')->take(5)->get();

        return response()->json([
            'message' => 'Welcome to the Developer Dashboard',
            'tasks' => $tasks,
            'messages' => $messages,
        ]);
    }
}
