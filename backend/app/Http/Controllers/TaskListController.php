<?php

namespace App\Http\Controllers;

use App\Http\Requests\TasklistRequest;
use App\Models\TaskList;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;

class TaskListController extends Controller
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
     * Display a listing of the task lists.
     *
     * Only admins and developers can view task lists.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Authorize the action using the 'perform-crud-operations' Gate
        Gate::authorize('perform-crud-operations');

        // Retrieve all task lists with necessary relationships
        $taskLists = TaskList::with('tasks')->get();

        return response()->json($taskLists);
    }

    /**
     * Store a newly created task list in storage.
     *
     * Only admins and developers can create task lists.
     *
     * @param  \App\Http\Requests\TasklistRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(TasklistRequest $request)
    {
        // Authorize the action using the 'perform-crud-operations' Gate
        Gate::authorize('perform-crud-operations');

        // Create the task list with validated data
        $taskList = TaskList::create($request->validated());

        return response()->json([
            'message' => 'Task List created successfully.',
            'taskList' => $taskList,
        ], 201);
    }

    /**
     * Display the specified task list.
     *
     * Only admins and developers can view a specific task list.
     *
     * @param  \App\Models\TaskList  $taskList
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(TaskList $taskList)
    {
        // Authorize the action using the 'perform-crud-operations' Gate
        Gate::authorize('perform-crud-operations');

        return response()->json($taskList->load('tasks'));
    }

    /**
     * Update the specified task list in storage.
     *
     * Only admins and developers can update task lists.
     *
     * @param  \App\Http\Requests\TasklistRequest  $request
     * @param  \App\Models\TaskList  $taskList
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(TasklistRequest $request, TaskList $taskList)
    {
        // Authorize the action using the 'perform-crud-operations' Gate
        Gate::authorize('perform-crud-operations');

        // Update the task list with validated data
        $taskList->update($request->validated());

        return response()->json([
            'message' => 'Task List updated successfully.',
            'taskList' => $taskList,
        ]);
    }

    /**
     * Remove the specified task list from storage.
     *
     * Only admins and developers can delete task lists.
     *
     * @param  \App\Models\TaskList  $taskList
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(TaskList $taskList)
    {
        // Authorize the action using the 'perform-crud-operations' Gate
        Gate::authorize('perform-crud-operations');

        // Delete the task list
        $taskList->delete();

        return response()->json(null, 204);
    }
}
