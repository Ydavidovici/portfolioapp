<?php

namespace App\Http\Controllers;

use App\Models\ChecklistItem;
use App\Http\Requests\ChecklistItemRequest;
use Illuminate\Support\Facades\Gate;

class ChecklistItemController extends Controller
{
    /**
     * Display a listing of the checklist items.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $checklistItems = ChecklistItem::all();

        // Optionally transform the data
        $checklistItems = $checklistItems->map(function ($item) {
            return $item->only(['id', 'description', 'is_completed', 'checklist_id']);
        });

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
        Gate::authorize('perform-crud-operations');

        $checklistItem = ChecklistItem::create($request->validated());

        return response()->json([
            'message' => 'Checklist item created successfully.',
            'checklist_item' => $checklistItem->only(['id', 'description', 'is_completed', 'checklist_id']),
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
        return response()->json($checklistItem->only(['id', 'description', 'is_completed', 'checklist_id']));
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
        Gate::authorize('perform-crud-operations');

        $checklistItem->update($request->validated());

        return response()->json([
            'message' => 'Checklist item updated successfully.',
            'checklist_item' => $checklistItem->only(['id', 'description', 'is_completed', 'checklist_id']),
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
        Gate::authorize('perform-crud-operations');

        $checklistItem->delete();

        return response()->json([
            'message' => 'Checklist item deleted successfully.',
        ]);
    }
}
