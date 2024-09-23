<?php

namespace App\Http\Controllers;

use App\Models\ChecklistItem;
use App\Http\Requests\ChecklistItemRequest;
use Illuminate\Support\Facades\Gate;

class ChecklistItemController extends Controller
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
     * Display a listing of the checklist items.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Any authenticated user can view checklist items
        $checklistItems = ChecklistItem::all();
        return response()->json($checklistItems);
    }

    /**
     * Store a newly created checklist item in storage.
     *
     * @param  \App\Http\Requests\ChecklistItemRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ChecklistItemRequest $request)
    {
        // Only admins and developers can create checklist items
        Gate::authorize('perform-crud-operations');

        $checklistItem = ChecklistItem::create($request->validated());

        return response()->json([
            'message' => 'Checklist item created successfully.',
            'checklist_item' => $checklistItem,
        ], 201);
    }

    /**
     * Display the specified checklist item.
     *
     * @param  \App\Models\ChecklistItem  $checklistItem
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(ChecklistItem $checklistItem)
    {
        // Any authenticated user can view a specific checklist item
        return response()->json($checklistItem);
    }

    /**
     * Update the specified checklist item in storage.
     *
     * @param  \App\Http\Requests\ChecklistItemRequest  $request
     * @param  \App\Models\ChecklistItem  $checklistItem
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(ChecklistItemRequest $request, ChecklistItem $checklistItem)
    {
        // Only admins and developers can update checklist items
        Gate::authorize('perform-crud-operations');

        $checklistItem->update($request->validated());

        return response()->json([
            'message' => 'Checklist item updated successfully.',
            'checklist_item' => $checklistItem,
        ]);
    }

    /**
     * Remove the specified checklist item from storage.
     *
     * @param  \App\Models\ChecklistItem  $checklistItem
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(ChecklistItem $checklistItem)
    {
        // Only admins and developers can delete checklist items
        Gate::authorize('perform-crud-operations');

        $checklistItem->delete();

        return response()->json([
            'message' => 'Checklist item deleted successfully.',
        ]);
    }
}
