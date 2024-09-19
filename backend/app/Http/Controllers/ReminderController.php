<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReminderRequest;
use App\Models\Reminder;
use Illuminate\Http\Request;

class ReminderController extends Controller
{
    public function index()
    {
        return Reminder::all();
    }

    public function store(ReminderRequest $request)
    {
        $reminder = Reminder::create($request->validated());
        return response()->json($reminder, 201);
    }

    public function show(Reminder $reminder)
    {
        return response()->json($reminder);
    }

    public function update(ReminderRequest $request, Reminder $reminder)
    {
        $reminder->update($request->validated());
        return response()->json($reminder);
    }

    public function destroy(Reminder $reminder)
    {
        $reminder->delete();
        return response()->json(null, 204);
    }
}
