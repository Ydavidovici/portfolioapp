<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Requests\TaskRequest;

class TaskController extends Controller
{
    public function index()
    {
        // Retrieve all tasks
        $tasks = Task::all();

        return response()->json($tasks);
    }

    public function store(TaskRequest $request)
    {
        // Create a new task
        $task = Task::create($request->validated());

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        // Show a single task
        return response()->json($task);
    }

    public function update(TaskRequest $request, Task $task)
    {
        // Update the task
        $task->update($request->validated());

        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        // Delete the task
        $task->delete();

        return response()->json(null, 204);
    }
}
