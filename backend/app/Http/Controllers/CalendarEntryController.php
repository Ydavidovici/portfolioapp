<?php

namespace App\Http\Controllers;

use App\Models\CalendarEntry;
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
     * Transform a calendar entry to an array with formatted date.
     *
     * @param  \App\Models\CalendarEntry  $calendarEntry
     * @return array
     */
    protected function transformCalendarEntry(CalendarEntry $calendarEntry)
    {
        return $calendarEntry->only([
            'id',
            'title',
            'date',
            'start_time',
            'end_time',
            'user_id',
        ]);
    }

    /**
     * Display a listing of the calendar entries.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Authorization: Any authenticated user can view calendar entries
        $calendarEntries = CalendarEntry::with('user')->get();

        // Transform each calendar entry
        $calendarEntries = $calendarEntries->map(function ($entry) {
            return $this->transformCalendarEntry($entry);
        });

        return response()->json($calendarEntries);
    }

    /**
     * Store a newly created calendar entry in storage.
     *
     * @param  \App\Http\Requests\CalendarEntryRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(CalendarEntryRequest $request)
    {
        // Authorization: Only users with 'perform-crud-operations' Gate can create calendar entries
        Gate::authorize('perform-crud-operations');

        $calendarEntry = CalendarEntry::create($request->validated());

        $calendarEntryData = $this->transformCalendarEntry($calendarEntry);

        return response()->json([
            'message' => 'Calendar entry created successfully.',
            'calendar_entry' => $calendarEntryData
        ], 201);
    }

    /**
     * Display the specified calendar entry.
     *
     * @param  \App\Models\CalendarEntry  $calendarEntry
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(CalendarEntry $calendarEntry)
    {
        // Authorization: Any authenticated user can view a specific calendar entry
        $calendarEntryData = $this->transformCalendarEntry($calendarEntry);

        return response()->json($calendarEntryData);
    }

    /**
     * Update the specified calendar entry in storage.
     *
     * @param  \App\Http\Requests\CalendarEntryRequest  $request
     * @param  \App\Models\CalendarEntry  $calendarEntry
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(CalendarEntryRequest $request, CalendarEntry $calendarEntry)
    {
        // Authorization: Only users with 'perform-crud-operations' Gate can update calendar entries
        Gate::authorize('perform-crud-operations');

        $calendarEntry->update($request->validated());

        $calendarEntryData = $this->transformCalendarEntry($calendarEntry);

        return response()->json([
            'message' => 'Calendar entry updated successfully.',
            'calendar_entry' => $calendarEntryData
        ]);
    }

    /**
     * Remove the specified calendar entry from storage.
     *
     * @param  \App\Models\CalendarEntry  $calendarEntry
     * @return \Illuminate\Http\JsonResponse
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
