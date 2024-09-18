<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Return data for the admin dashboard
        return response()->json([
            'message' => 'Welcome to the Admin Dashboard',
            // Include any necessary data
        ]);
    }
}
