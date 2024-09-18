<?php

namespace App\Http\Controllers\Client;

use Illuminate\Http\Request;

class ClientDashboardController extends Controller
{
    public function index()
    {
        // Return data for the client dashboard
        return response()->json([
            'message' => 'Welcome to the Client Dashboard',
            // Include any necessary data
        ]);
    }
}
