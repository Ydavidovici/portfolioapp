<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Http\Requests\NoteRequest;
use Illuminate\Support\Facades\Gate;

class NoteController extends Controller
{
    /**
     * Instantiate a new controller instance.
     *
     * Authentication is handled by the route middleware.
     *
     * @return void
     */
    public function __construct()
    {
        // Removed the 'auth' middleware to prevent conflicts
    }

    /**
     * Display a listing of the notes.
     *
     * Admins and Developers can view all notes.
     * Clients do not have access to view notes.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = auth()->user();

        if (Gate::allows('perform-crud-operations')) {
            // Admins and Developers can view all notes
            $notes = Note::with(['user', 'project'])->get();
        } else {
            // Clients cannot view notes
            return response()->json([
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        return response()->json($notes);
    }

    /**
     * Store a newly created note in storage.
     *
     * Only Admins and Developers can create notes.
     *
     * @param  \App\Http\Requests\NoteRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(NoteRequest $request)
    {
        // Only Admins and Developers can create notes
        Gate::authorize('perform-crud-operations');

        $validatedData = $request->validated();
        $validatedData['user_id'] = auth()->user()->id;

        $note = Note::create($validatedData);

        return response()->json([
            'message' => 'Note created successfully.',
            'note' => $note,
        ], 201);
    }

    /**
     * Display the specified note.
     *
     * Admins and Developers can view any note.
     *
     * @param  \App\Models\Note  $note
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Note $note)
    {
        $user = auth()->user();

        if (Gate::allows('perform-crud-operations')) {
            // Admins and Developers can view any note
            return response()->json($note->load(['user', 'project']));
        }

        // Unauthorized access
        return response()->json([
            'message' => 'This action is unauthorized.',
        ], 403);
    }

    /**
     * Update the specified note in storage.
     *
     * Only Admins and Developers can update notes.
     *
     * @param  \App\Http\Requests\NoteRequest  $request
     * @param  \App\Models\Note  $note
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(NoteRequest $request, Note $note)
    {
        // Only Admins and Developers can update notes
        Gate::authorize('perform-crud-operations');

        $note->update($request->validated());

        return response()->json([
            'message' => 'Note updated successfully.',
            'note' => $note,
        ]);
    }

    /**
     * Remove the specified note from storage.
     *
     * Only Admins and Developers can delete notes.
     *
     * @param  \App\Models\Note  $note
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Note $note)
    {
        // Only Admins and Developers can delete notes
        Gate::authorize('perform-crud-operations');

        $note->delete();

        return response()->json([
            'message' => 'Note deleted successfully.',
        ]);
    }
}
