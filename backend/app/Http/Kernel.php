<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middleware = [
        // Global middleware can be added here if necessary
        // \Fruitcake\Cors\HandleCors::class,
    ];

    protected $middlewareGroups = [
        'web' => [
            // If not using web routes, you can leave this empty or remove it
        ],

        'api' => [
            // Throttle requests
            'throttle:api',

            // Substitute route bindings
            \Illuminate\Routing\Middleware\SubstituteBindings::class,

            // Authentication middleware (can also be applied per route)
            // 'auth:api',
        ],
    ];

    protected $routeMiddleware = [
        'auth' => \App\Http\Middleware\Authenticate::class,
        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        'auth.session' => \Illuminate\Session\Middleware\AuthenticateSession::class,

        'can' => \Illuminate\Auth\Middleware\Authorize::class,
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,

        'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class,

        'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class,

        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,

        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,

        // Custom middleware
        'role' => \App\Http\Middleware\CheckRole::class,
    ];
}
