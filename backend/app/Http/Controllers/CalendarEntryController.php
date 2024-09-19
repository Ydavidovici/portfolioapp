<?php

namespace App\Http\Controllers;

use App\Models\CalendarEntry;
use Illuminate\Http\Request;
use App\Http\Requests\CalendarEntryRequest;

class CalendarEntryController extends Controller
{
    /**
     * Display a listing of the calendar entries.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $calendarEntries = CalendarEntry::with('user')->get();
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
        $calendarEntry = CalendarEntry::create($request->validated());

        return response()->json([
            'message' => 'Calendar entry created successfully.',
            'calendar_entry' => $calendarEntry
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
        return response()->json($calendarEntry->load('user'));
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
        $calendarEntry->update($request->validated());

        return response()->json([
            'message' => 'Calendar entry updated successfully.',
            'calendar_entry' => $calendarEntry
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
        $calendarEntry->delete();

        return response()->json([
            'message' => 'Calendar entry deleted successfully.'
        ]);
    }
}
