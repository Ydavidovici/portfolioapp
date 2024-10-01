<?php

namespace App\Http\Controllers;

use App\Models\CalendarEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\CalendarEntryRequest;
use Illuminate\Support\Facades\Gate;

class CalendarEntryController extends Controller
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
     * Display a listing of the calendar entries.
     *
     * @return JsonResponse
     */
    public function index()
    {
        // Authorization: Any authenticated user can view calendar entries
        $calendarEntries = CalendarEntry::with('user')->get();
        return response()->json($calendarEntries);
    }

    /**
     * Store a newly created calendar entry in storage.
     *
     * @param  \App\Http\Requests\CalendarEntryRequest  $request
     * @return JsonResponse
     */
    public function store(CalendarEntryRequest $request)
    {
        // Authorization: Only users with 'perform-crud-operations' Gate can create calendar entries
        Gate::authorize('perform-crud-operations');

        $calendarEntry = CalendarEntry::create($request->validated());

        return response()->json([
            'message' => 'Calendar entry created successfully.',
            'calendar_entry' => $calendarEntry
        ], 201);
    }

    /**
     * Display the specified calendar entry.
     *
     * @param CalendarEntry $calendarEntry
     * @return JsonResponse
     */
    public function show(CalendarEntry $calendarEntry)
    {
        // Authorization: Any authenticated user can view a specific calendar entry
        return response()->json($calendarEntry->load('user'));
    }

    /**
     * Update the specified calendar entry in storage.
     *
     * @param  \App\Http\Requests\CalendarEntryRequest  $request
     * @param CalendarEntry $calendarEntry
     * @return JsonResponse
     */
    public function update(CalendarEntryRequest $request, CalendarEntry $calendarEntry)
    {
        // Authorization: Only users with 'perform-crud-operations' Gate can update calendar entries
        Gate::authorize('perform-crud-operations');

        $calendarEntry->update($request->validated());

        return response()->json([
            'message' => 'Calendar entry updated successfully.',
            'calendar_entry' => $calendarEntry
        ]);
    }

    /**
     * Remove the specified calendar entry from storage.
     *
     * @param CalendarEntry $calendarEntry
     * @return JsonResponse
     */
    public function destroy(CalendarEntry $calendarEntry)
    {
        // Authorization: Only users with 'perform-crud-operations' Gate can delete calendar entries
        Gate::authorize('perform-crud-operations');

        $calendarEntry->delete();

        return response()->json([
            'message' => 'Calendar entry deleted successfully.'
        ]);
    }
}
