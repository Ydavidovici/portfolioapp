<?php

namespace App\Http\Controllers;

use App\Models\Checklist;
use App\Http\Requests\ChecklistRequest;
use Illuminate\Support\Facades\Gate;

class ChecklistController extends Controller
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
     * Display a listing of the checklists.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Authorization: Any authenticated user can view checklists
        $checklists = Checklist::with('items')->get();
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
        // Authorization: Only users with 'perform-crud-operations' Gate can create checklists
        Gate::authorize('perform-crud-operations');

        $checklist = Checklist::create($request->validated());

        return response()->json([
            'message' => 'Checklist created successfully.',
            'checklist' => $checklist,
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
        // Authorization: Any authenticated user can view a specific checklist
        return response()->json($checklist->load('items'));
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
        // Authorization: Only users with 'perform-crud-operations' Gate can update checklists
        Gate::authorize('perform-crud-operations');

        $checklist->update($request->validated());

        return response()->json([
            'message' => 'Checklist updated successfully.',
            'checklist' => $checklist,
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
        // Authorization: Only users with 'perform-crud-operations' Gate can delete checklists
        Gate::authorize('perform-crud-operations');

        $checklist->delete();

        return response()->json([
            'message' => 'Checklist deleted successfully.',
        ]);
    }
}
