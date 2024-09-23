<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class DeveloperDashboardController extends Controller
{
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        // Authorization: Check if the user can access the developer dashboard
        if (!Gate::allows('access-developer-dashboard')) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        // Fetch developer-specific data
        $projects = Project::with(['client', 'tasks', 'feedback'])->get();

        // Fetch the latest 5 messages for the developer
        $messages = Message::where('receiver_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'message' => 'Welcome to the Developer Dashboard',
            'projects' => $projects,
            'messages' => $messages,
        ]);
    }
}
