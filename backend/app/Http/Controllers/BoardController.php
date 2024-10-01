<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;
use App\Http\Requests\BoardRequest;
use Illuminate\Support\Facades\Gate;

class BoardController extends Controller
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
        $this->middleware('auth'); // Ensure the use of regular auth middleware
    }

    /**
     * Display a listing of the boards.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Authorization: Any authenticated user can view boards
        $boards = Board::with('project')->get();
        return response()->json($boards);
    }

    /**
     * Store a newly created board in storage.
     *
     * @param  \App\Http\Requests\BoardRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(BoardRequest $request)
    {
        // Authorization: Only users with 'perform-crud-operations' gate can create boards
        Gate::authorize('perform-crud-operations');

        $board = Board::create($request->validated());

        return response()->json([
            'message' => 'Board created successfully.',
            'board' => $board
        ], 201);
    }

    /**
     * Display the specified board.
     *
     * @param  \App\Models\Board  $board
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Board $board)
    {
        // Authorization: Any authenticated user can view a specific board
        return response()->json($board->load('project', 'taskLists'));
    }

    /**
     * Update the specified board in storage.
     *
     * @param  \App\Http\Requests\BoardRequest  $request
     * @param  \App\Models\Board  $board
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(BoardRequest $request, Board $board)
    {
        // Authorization: Only users with 'perform-crud-operations' gate can update boards
        Gate::authorize('perform-crud-operations');

        $board->update($request->validated());

        return response()->json([
            'message' => 'Board updated successfully.',
            'board' => $board
        ]);
    }

    /**
     * Remove the specified board from storage.
     *
     * @param  \App\Models\Board  $board
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Board $board)
    {
        // Authorization: Only users with 'perform-crud-operations' gate can delete boards
        Gate::authorize('perform-crud-operations');

        $board->delete();

        return response()->json([
            'message' => 'Board deleted successfully.'
        ]);
    }
}
