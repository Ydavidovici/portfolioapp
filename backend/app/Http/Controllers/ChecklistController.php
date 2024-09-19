<?php

namespace App\Http\Controllers;

use App\Models\Checklist;
use App\Http\Requests\ChecklistRequest;

class ChecklistController extends Controller
{
    public function index()
    {
        $checklists = Checklist::with('items')->get();
        return response()->json($checklists);
    }

    public function store(ChecklistRequest $request)
    {
        $checklist = Checklist::create($request->validated());

        return response()->json([
            'message' => 'Checklist created successfully.',
            'checklist' => $checklist,
        ], 201);
    }

    public function show(Checklist $checklist)
    {
        return response()->json($checklist->load('items'));
    }

    public function update(ChecklistRequest $request, Checklist $checklist)
    {
        $checklist->update($request->validated());

        return response()->json([
            'message' => 'Checklist updated successfully.',
            'checklist' => $checklist,
        ]);
    }

    public function destroy(Checklist $checklist)
    {
        $checklist->delete();

        return response()->json([
            'message' => 'Checklist deleted successfully.',
        ]);
    }
}
