<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // Gate to access Admin Dashboard
        Gate::define('access-admin-dashboard', function (User $user) {
            return $user->hasRole('admin');
        });

        // Gate to access Client Dashboard
        Gate::define('access-client-dashboard', function (User $user) {
            return $user->hasRole('client');
        });

        // Gate to access Developer Dashboard
        Gate::define('access-developer-dashboard', function (User $user) {
            return $user->hasRole('developer');
        });

        // Gate to perform CRUD operations
        Gate::define('perform-crud-operations', function (User $user) {
            return $user->hasAnyRole(['admin', 'developer']);
        });

        Gate::define('manage-users/roles', function (User $user) {
            return $user->hasAnyRole(['admin']);
        });

        Gate::define('manage-client-things', function (User $user) {
        return $user->hasAnyRole(['client']);
    });
    }
}
