<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    /**
     * Check if the authenticated user has any of the specified roles.
     *
     * @param  string|array  $roles
     * @return bool
     */
    protected function hasAnyRole($roles): bool
    {
        if (is_array($roles)) {
            foreach ($roles as $role) {
                if (Gate::allows("access-{$role}-dashboard")) {
                    return true;
                }
            }
            return false;
        }

        return Gate::allows("access-{$roles}-dashboard");
    }

    /**
     * Enforce role-based access control using Gates.
     *
     * @param  string|array  $roles
     * @return \Illuminate\Http\JsonResponse|null
     */
    protected function authorizeRoles($roles)
    {
        if ($this->hasAnyRole($roles)) {
            return null;
        }

        return response()->json(['message' => 'Forbidden.'], 403);
    }
}
