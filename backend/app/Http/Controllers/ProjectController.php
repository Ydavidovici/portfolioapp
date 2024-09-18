<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Requests\ProjectRequest;

class ProjectController extends Controller
{
    public function index()
    {
        // Retrieve all projects
        $projects = Project::all();

        return response()->json($projects);
    }

    public function store(ProjectRequest $request)
    {
        // Create a new project
        $project = Project::create($request->validated());

        return response()->json($project, 201);
    }

    public function show(Project $project)
    {
        // Show a single project
        return response()->json($project);
    }

    public function update(ProjectRequest $request, Project $project)
    {
        // Update the project
        $project->update($request->validated());

        return response()->json($project);
    }

    public function destroy(Project $project)
    {
        // Delete the project
        $project->delete();

        return response()->json(null, 204);
    }
}
