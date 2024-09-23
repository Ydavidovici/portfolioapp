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
     * Apply authentication middleware to all routes in this controller.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the reminders.
     *
     * Only admins and developers can view reminders.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Authorize the action using the 'perform-crud-operations' Gate
        Gate::authorize('perform-crud-operations');

        // Retrieve all reminders with any necessary relationships
        $reminders = Reminder::all();

        return response()->json($reminders);
    }

    /**
     * Store a newly created reminder in storage.
     *
     * Only admins and developers can create reminders.
     *
     * @param  \App\Http\Requests\ReminderRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ReminderRequest $request)
    {
        // Authorize the action using the 'perform-crud-operations' Gate
        Gate::authorize('perform-crud-operations');

        // Create the reminder with validated data
        $reminder = Reminder::create($request->validated());

        return response()->json([
            'message' => 'Reminder created successfully.',
            'reminder' => $reminder,
        ], 201);
    }

    /**
     * Display the specified reminder.
     *
     * Only admins and developers can view a specific reminder.
     *
     * @param  \App\Models\Reminder  $reminder
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Reminder $reminder)
    {
        // Authorize the action using the 'perform-crud-operations' Gate
        Gate::authorize('perform-crud-operations');

        return response()->json($reminder);
    }

    /**
     * Update the specified reminder in storage.
     *
     * Only admins and developers can update reminders.
     *
     * @param  \App\Http\Requests\ReminderRequest  $request
     * @param  \App\Models\Reminder  $reminder
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(ReminderRequest $request, Reminder $reminder)
    {
        // Authorize the action using the 'perform-crud-operations' Gate
        Gate::authorize('perform-crud-operations');

        // Update the reminder with validated data
        $reminder->update($request->validated());

        return response()->json([
            'message' => 'Reminder updated successfully.',
            'reminder' => $reminder,
        ]);
    }

    /**
     * Remove the specified reminder from storage.
     *
     * Only admins and developers can delete reminders.
     *
     * @param  \App\Models\Reminder  $reminder
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Reminder $reminder)
    {
        // Authorize the action using the 'perform-crud-operations' Gate
        Gate::authorize('perform-crud-operations');

        // Delete the reminder
        $reminder->delete();

        return response()->json(null, 204);
    }
}
