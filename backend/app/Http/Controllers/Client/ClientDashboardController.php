<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ClientDashboardController extends Controller
{
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        // Authorization: Check if the user can access the client dashboard
        if (!Gate::allows('access-client-dashboard')) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        // Fetch client-specific data
        $messages = Message::where('receiver_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $documents = Document::where('uploaded_by', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'message' => 'Welcome to the Client Dashboard',
            'messages' => $messages,
            'documents' => $documents,
        ]);
    }
}
