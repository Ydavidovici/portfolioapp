<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;
use App\Http\Requests\BoardRequest;

class BoardController extends Controller
{
    /**
     * Display a listing of the boards.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
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
        $board->delete();

        return response()->json([
            'message' => 'Board deleted successfully.'
        ]);
    }
}
