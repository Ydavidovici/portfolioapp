<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Http\Requests\NoteRequest;

class NoteController extends Controller
{
    public function index()
    {
        $notes = Note::with('user', 'project')->get();
        return response()->json($notes);
    }

    public function store(NoteRequest $request)
    {
        $note = Note::create($request->validated());

        return response()->json([
            'message' => 'Note created successfully.',
            'note' => $note,
        ], 201);
    }

    public function show(Note $note)
    {
        return response()->json($note->load('user', 'project'));
    }

    public function update(NoteRequest $request, Note $note)
    {
        $note->update($request->validated());

        return response()->json([
            'message' => 'Note updated successfully.',
            'note' => $note,
        ]);
    }

    public function destroy(Note $note)
    {
        $note->delete();

        return response()->json([
            'message' => 'Note deleted successfully.',
        ]);
    }
}
