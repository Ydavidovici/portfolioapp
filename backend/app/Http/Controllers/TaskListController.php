<?php

namespace App\Http\Controllers;

use App\Http\Requests\TasklistRequest;
use App\Models\TaskList;
use Illuminate\Http\Request;

class TaskListController extends Controller
{
    public function index()
    {
        return TaskList::with('tasks')->get();
    }

    public function store(TasklistRequest $request)
    {
        $taskList = TaskList::create($request->validated());
        return response()->json($taskList, 201);
    }

    public function show(TaskList $taskList)
    {
        return response()->json($taskList->load('tasks'));
    }

    public function update(TasklistRequest $request, TaskList $taskList)
    {
        $taskList->update($request->validated());
        return response()->json($taskList);
    }

    public function destroy(TaskList $taskList)
    {
        $taskList->delete();
        return response()->json(null, 204);
    }
}
