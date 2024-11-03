<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Models\Task;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;

class TaskController extends Controller
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
       // $this->middleware('auth');
    }

    /**
     * Display a listing of the tasks.
     *
     * Only admins and developers can view tasks.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Authorize the action using the 'perform-crud-operations' Gate
        Gate::authorize('perform-crud-operations');

        // Retrieve all tasks with necessary relationships
        $tasks = Task::with(['taskList', 'user', 'checklists'])->get();

        return response()->json($tasks);
    }

    /**
     * Store a newly created task in storage.
     *
     * Only admins and developers can create tasks.
     *
     * @param  \App\Http\Requests\TaskRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(TaskRequest $request)
    {
        // Authorize the action using the 'perform-crud-operations' Gate
        Gate::authorize('perform-crud-operations');

        // Create the task with validated data
        $task = Task::create($request->validated());

        return response()->json([
            'message' => 'Task created successfully.',
            'task' => $task,
        ], 201);
    }

    /**
     * Display the specified task.
     *
     * Only admins and developers can view a specific task.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Task $task)
    {
        // Authorize the action using the 'perform-crud-operations' Gate
        Gate::authorize('perform-crud-operations');

        return response()->json($task->load(['taskList', 'user', 'checklists']));
    }

    /**
     * Update the specified task in storage.
     *
     * Only admins and developers can update tasks.
     *
     * @param  \App\Http\Requests\TaskRequest  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(TaskRequest $request, Task $task)
    {
        // Authorize the action using the 'perform-crud-operations' Gate
        Gate::authorize('perform-crud-operations');

        // Update the task with validated data
        $task->update($request->validated());

        return response()->json([
            'message' => 'Task updated successfully.',
            'task' => $task,
        ]);
    }

    /**
     * Remove the specified task from storage.
     *
     * Only admins and developers can delete tasks.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Task $task)
    {
        // Authorize the action using the 'perform-crud-operations' Gate
        Gate::authorize('perform-crud-operations');

        // Delete the task
        $task->delete();

        return response()->json(null, 204);
    }
}
