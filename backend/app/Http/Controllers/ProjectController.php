<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectRequest;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        return Project::with(['client', 'boards', 'feedback', 'invoices', 'documents', 'tasks'])->get();
    }

    public function store(ProjectRequest $request)
    {
        $project = Project::create($request->validated());
        return response()->json($project, 201);
    }

    public function show(Project $project)
    {
        return response()->json($project->load(['client', 'boards', 'feedback', 'invoices', 'documents', 'tasks']));
    }

    public function update(ProjectRequest $request, Project $project)
    {
        $project->update($request->validated());
        return response()->json($project);
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(null, 204);
    }
}
