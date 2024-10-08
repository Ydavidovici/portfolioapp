<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReminderRequest;
use App\Models\Reminder;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;

class ReminderController extends Controller
{
    /**
     * Instantiate a new controller instance.
     *
     * Apply API authentication middleware to all routes in this controller.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api'); // Changed from 'auth' to 'auth:api'
    }

    public function index()
    {
        Gate::authorize('perform-crud-operations');

        $reminders = Reminder::all();

        return response()->json($reminders);
    }

    public function store(ReminderRequest $request)
    {
        Gate::authorize('perform-crud-operations');

        $data = $request->validated();
        $data['user_id'] = auth()->id(); // Set the user_id to the authenticated user's ID

        $reminder = Reminder::create($data);

        return response()->json([
            'message' => 'Reminder created successfully.',
            'reminder' => $reminder,
        ], 201);
    }

    public function show(Reminder $reminder)
    {
        Gate::authorize('perform-crud-operations');

        return response()->json($reminder);
    }

    public function update(ReminderRequest $request, Reminder $reminder)
    {
        Gate::authorize('perform-crud-operations');

        $reminder->update($request->validated());

        return response()->json([
            'message' => 'Reminder updated successfully.',
            'reminder' => $reminder,
        ]);
    }

    public function destroy(Reminder $reminder)
    {
        Gate::authorize('perform-crud-operations');

        $reminder->delete();

        return response()->json(null, 204);
    }
}
