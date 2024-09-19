<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Message;
use Illuminate\Http\Request;

class ClientDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Fetch all projects related to the client
        $projects = Project::where('client_id', $user->id)->with('tasks', 'invoices', 'feedback')->get();

        // Fetch the latest messages for the client
        $messages = Message::where('receiver_id', $user->id)->orderBy('created_at', 'desc')->take(5)->get();

        return response()->json([
            'message' => 'Welcome to the Client Dashboard',
            'projects' => $projects,
            'messages' => $messages,
        ]);
    }
}
