<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectRequest;
use App\Models\Project;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;

class ProjectController extends Controller
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
    }

    /**
     * Display a listing of the projects.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = auth()->user();

        if (Gate::allows('perform-crud-operations')) {
            // Admins and Developers can view all projects
            $projects = Project::with(['client', 'boards', 'feedback', 'invoices', 'documents', 'tasks'])->get();
        } else {
            // Clients can view only their own projects
            $projects = Project::with(['client', 'boards', 'feedback', 'invoices', 'documents', 'tasks'])
                ->where('client_id', $user->id)
                ->get();
        }

        return response()->json($projects);
    }

    /**
     * Store a newly created project in storage.
     *
     * Only Admins and Developers can create projects.
     *
     * @param  \App\Http\Requests\ProjectRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ProjectRequest $request)
    {
        // Only Admins and Developers can create projects
        Gate::authorize('perform-crud-operations');

        $project = Project::create($request->validated());

        return response()->json([
            'message' => 'Project created successfully.',
            'project' => $project,
        ], 201);
    }

    /**
     * Display the specified project.
     *
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Project $project)
    {
        $user = auth()->user();

        if (Gate::allows('perform-crud-operations') || $project->client_id === $user->id) {
            // Admins and Developers can view any project
            // Clients can view only their own projects
            return response()->json($project->load(['client', 'boards', 'feedback', 'invoices', 'documents', 'tasks']));
        }

        // Unauthorized access
        return response()->json([
            'message' => 'This action is unauthorized.',
        ], 403);
    }

    /**
     * Update the specified project in storage.
     *
     * Only Admins and Developers can update projects.
     *
     * @param  \App\Http\Requests\ProjectRequest  $request
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(ProjectRequest $request, Project $project)
    {
        // Only Admins and Developers can update projects
        Gate::authorize('perform-crud-operations');

        $project->update($request->validated());

        return response()->json([
            'message' => 'Project updated successfully.',
            'project' => $project,
        ]);
    }

    /**
     * Remove the specified project from storage.
     *
     * Only Admins and Developers can delete projects.
     *
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Project $project)
    {
        // Only Admins and Developers can delete projects
        Gate::authorize('perform-crud-operations');

        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully.',
        ]);
    }
}
