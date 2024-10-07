<?php

namespace App\Http\Controllers;

use App\Models\Checklist;
use App\Http\Requests\ChecklistRequest;
use Illuminate\Support\Facades\Gate;

class ChecklistController extends Controller
{
    /**
     * Display a listing of the checklists.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $checklists = Checklist::with('items')->get();

        // Transform the data if necessary
        $checklists = $checklists->map(function ($checklist) {
            return $checklist->only(['id', 'name', 'task_id']);
        });

        return response()->json($checklists);
    }

    /**
     * Store a newly created checklist in storage.
     *
     * @param  \App\Http\Requests\ChecklistRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ChecklistRequest $request)
    {
        Gate::authorize('perform-crud-operations');

        $checklist = Checklist::create($request->validated());

        return response()->json([
            'message' => 'Checklist created successfully.',
            'checklist' => $checklist->only(['id', 'name', 'task_id']),
        ], 201);
    }

    /**
     * Display the specified checklist.
     *
     * @param  \App\Models\Checklist  $checklist
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Checklist $checklist)
    {
        return response()->json($checklist->only(['id', 'name', 'task_id']));
    }

    /**
     * Update the specified checklist in storage.
     *
     * @param  \App\Http\Requests\ChecklistRequest  $request
     * @param  \App\Models\Checklist  $checklist
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(ChecklistRequest $request, Checklist $checklist)
    {
        Gate::authorize('perform-crud-operations');

        $checklist->update($request->validated());

        return response()->json([
            'message' => 'Checklist updated successfully.',
            'checklist' => $checklist->only(['id', 'name', 'task_id']),
        ]);
    }

    /**
     * Remove the specified checklist from storage.
     *
     * @param  \App\Models\Checklist  $checklist
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Checklist $checklist)
    {
        Gate::authorize('perform-crud-operations');

        $checklist->delete();

        return response()->json([
            'message' => 'Checklist deleted successfully.',
        ]);
    }
}
