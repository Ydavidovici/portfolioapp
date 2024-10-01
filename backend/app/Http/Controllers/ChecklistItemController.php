<?php

namespace App\Http\Controllers;

use App\Models\ChecklistItem;
use App\Http\Requests\ChecklistItemRequest;
use Illuminate\Support\Facades\Gate;

class ChecklistItemController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $checklistItems = ChecklistItem::all();

        // Optionally transform the data
        $checklistItems = $checklistItems->map(function ($item) {
            return $item->only(['id', 'description', 'is_completed', 'checklist_id']);
        });

        return response()->json($checklistItems);
    }

    public function store(ChecklistItemRequest $request)
    {
        Gate::authorize('perform-crud-operations');

        $checklistItem = ChecklistItem::create($request->validated());

        return response()->json([
            'message' => 'Checklist item created successfully.',
            'checklist_item' => $checklistItem->only(['id', 'description', 'is_completed', 'checklist_id']),
        ], 201);
    }

    public function show(ChecklistItem $checklistItem)
    {
        return response()->json($checklistItem->only(['id', 'description', 'is_completed', 'checklist_id']));
    }

    public function update(ChecklistItemRequest $request, ChecklistItem $checklistItem)
    {
        Gate::authorize('perform-crud-operations');

        $checklistItem->update($request->validated());

        return response()->json([
            'message' => 'Checklist item updated successfully.',
            'checklist_item' => $checklistItem->only(['id', 'description', 'is_completed', 'checklist_id']),
        ]);
    }

    public function destroy(ChecklistItem $checklistItem)
    {
        Gate::authorize('perform-crud-operations');

        $checklistItem->delete();

        return response()->json([
            'message' => 'Checklist item deleted successfully.',
        ]);
    }
}
