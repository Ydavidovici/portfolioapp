<?php

namespace App\Http\Controllers;

use App\Models\ChecklistItem;
use App\Http\Requests\ChecklistItemRequest;

class ChecklistItemController extends Controller
{
    public function index()
    {
        $checklistItems = ChecklistItem::all();
        return response()->json($checklistItems);
    }

    public function store(ChecklistItemRequest $request)
    {
        $checklistItem = ChecklistItem::create($request->validated());

        return response()->json([
            'message' => 'Checklist item created successfully.',
            'checklist_item' => $checklistItem,
        ], 201);
    }

    public function show(ChecklistItem $checklistItem)
    {
        return response()->json($checklistItem);
    }

    public function update(ChecklistItemRequest $request, ChecklistItem $checklistItem)
    {
        $checklistItem->update($request->validated());

        return response()->json([
            'message' => 'Checklist item updated successfully.',
            'checklist_item' => $checklistItem,
        ]);
    }

    public function destroy(ChecklistItem $checklistItem)
    {
        $checklistItem->delete();

        return response()->json([
            'message' => 'Checklist item deleted successfully.',
        ]);
    }
}
