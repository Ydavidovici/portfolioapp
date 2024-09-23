<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoleRequest;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class RoleController extends Controller
{
    /**
     * Display a listing of the roles.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Authorization: Check if the user can manage users and roles
        if (!Gate::allows('manage-users/roles')) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $roles = Role::all();

        return response()->json($roles);
    }

    /**
     * Store a newly created role.
     *
     * @param  \App\Http\Requests\RoleRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(RoleRequest $request)
    {
        // Authorization: Check if the user can manage users and roles
        if (!Gate::allows('manage-users/roles')) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $role = Role::create($request->validated());

        return response()->json($role, 201);
    }

    /**
     * Display the specified role.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Role $role)
    {
        // Authorization: Check if the user can manage users and roles
        if (!Gate::allows('manage-users/roles')) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json($role);
    }

    /**
     * Update the specified role.
     *
     * @param  \App\Http\Requests\RoleRequest  $request
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(RoleRequest $request, Role $role)
    {
        // Authorization: Check if the user can manage users and roles
        if (!Gate::allows('manage-users/roles')) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $role->update($request->validated());

        return response()->json($role);
    }

    /**
     * Remove the specified role.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Role $role)
    {
        // Authorization: Check if the user can manage users and roles
        if (!Gate::allows('manage-users/roles')) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $role->delete();

        return response()->json(null, 204);
    }
}
